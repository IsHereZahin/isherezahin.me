"use client";

import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";
import { useState } from "react";

export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndices: number[];
}

interface QuizEditorProps {
    value: string;
    onChange: (val: string) => void;
    inputClass: string;
}

function parseQuiz(value: string): QuizQuestion[] {
    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return [];
        // Migrate old format (correctIndex) to new (correctIndices)
        return parsed.map((q: Record<string, unknown>) => ({
            question: q.question || "",
            options: Array.isArray(q.options) ? q.options : [],
            correctIndices: Array.isArray(q.correctIndices)
                ? q.correctIndices
                : typeof q.correctIndex === "number"
                    ? [q.correctIndex]
                    : [0],
        }));
    } catch { /* noop */ }
    return [];
}

export default function QuizEditor({ value, onChange, inputClass }: Readonly<QuizEditorProps>) {
    const [questions, setQuestions] = useState<QuizQuestion[]>(() => parseQuiz(value));

    const sync = (updated: QuizQuestion[]) => {
        setQuestions(updated);
        onChange(JSON.stringify(updated));
    };

    const addQuestion = () => {
        sync([...questions, { question: "", options: ["", ""], correctIndices: [0] }]);
    };

    const removeQuestion = (qi: number) => {
        sync(questions.filter((_, i) => i !== qi));
    };

    const updateQuestion = (qi: number, text: string) => {
        const updated = [...questions];
        updated[qi] = { ...updated[qi], question: text };
        sync(updated);
    };

    const updateOption = (qi: number, oi: number, text: string) => {
        const updated = [...questions];
        const opts = [...updated[qi].options];
        opts[oi] = text;
        updated[qi] = { ...updated[qi], options: opts };
        sync(updated);
    };

    const toggleCorrect = (qi: number, oi: number) => {
        const updated = [...questions];
        const current = updated[qi].correctIndices;
        const isSelected = current.includes(oi);
        let next: number[];
        if (isSelected) {
            // Don't allow removing the last correct answer
            if (current.length <= 1) return;
            next = current.filter((i) => i !== oi);
        } else {
            next = [...current, oi].sort((a, b) => a - b);
        }
        updated[qi] = { ...updated[qi], correctIndices: next };
        sync(updated);
    };

    const addOption = (qi: number) => {
        const updated = [...questions];
        updated[qi] = { ...updated[qi], options: [...updated[qi].options, ""] };
        sync(updated);
    };

    const removeOption = (qi: number, oi: number) => {
        const updated = [...questions];
        const opts = updated[qi].options.filter((_, i) => i !== oi);
        // Adjust correctIndices after removal
        const correctIndices = updated[qi].correctIndices
            .map((ci) => ci > oi ? ci - 1 : ci === oi ? -1 : ci)
            .filter((ci) => ci >= 0);
        updated[qi] = {
            ...updated[qi],
            options: opts,
            correctIndices: correctIndices.length > 0 ? correctIndices : [0],
        };
        sync(updated);
    };

    return (
        <div className="ml-8 space-y-3">
            {questions.map((q, qi) => (
                <div key={qi} className="border border-border rounded-lg p-3 space-y-2 bg-muted/10">
                    <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-muted-foreground mt-2 shrink-0">
                            Q{qi + 1}
                        </span>
                        <input
                            type="text"
                            value={q.question}
                            onChange={(e) => updateQuestion(qi, e.target.value)}
                            className={`${inputClass} text-xs flex-1`}
                            placeholder="Enter question..."
                        />
                        <button
                            onClick={() => removeQuestion(qi)}
                            className="p-1 text-destructive/60 hover:text-destructive transition-colors cursor-pointer shrink-0"
                            title="Remove question"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {q.correctIndices.length > 1 && (
                        <p className="text-[10px] text-muted-foreground ml-6">
                            Multiple correct answers ({q.correctIndices.length} selected)
                        </p>
                    )}

                    {/* Options */}
                    <div className="space-y-1.5 ml-6">
                        {q.options.map((opt, oi) => {
                            const isCorrect = q.correctIndices.includes(oi);
                            return (
                                <div key={oi} className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleCorrect(qi, oi)}
                                        className={`shrink-0 cursor-pointer transition-colors ${
                                            isCorrect
                                                ? "text-green-500"
                                                : "text-muted-foreground/40 hover:text-muted-foreground"
                                        }`}
                                        title={isCorrect ? "Correct answer (click to unmark)" : "Mark as correct"}
                                    >
                                        {isCorrect ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                    </button>
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => updateOption(qi, oi, e.target.value)}
                                        className={`${inputClass} text-xs flex-1`}
                                        placeholder={`Option ${oi + 1}`}
                                    />
                                    {q.options.length > 2 && (
                                        <button
                                            onClick={() => removeOption(qi, oi)}
                                            className="p-0.5 text-muted-foreground/40 hover:text-destructive transition-colors cursor-pointer shrink-0"
                                            title="Remove option"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        <button
                            onClick={() => addOption(qi)}
                            className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer ml-6"
                        >
                            <Plus className="w-3 h-3" /> Add option
                        </button>
                    </div>
                </div>
            ))}

            <button
                onClick={addQuestion}
                className="flex items-center gap-1.5 text-sm text-primary hover:underline cursor-pointer"
            >
                <Plus className="w-3.5 h-3.5" /> Add Question
            </button>
        </div>
    );
}
