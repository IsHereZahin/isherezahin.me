"use client";

import { courses } from "@/lib/api";
import { CheckCircle, ChevronLeft, ChevronRight, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface QuizQuestion {
    question: string;
    options: string[];
}

interface QuizResult {
    questionIndex: number;
    isCorrect: boolean;
    correctIndices: number[];
    userAnswer: number[];
}

interface SavedQuizResult {
    results: QuizResult[];
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    answers: Record<number, number[]>;
}

interface QuizPlayerProps {
    content: string;
    slug: string;
    lessonId: string;
    savedResult?: SavedQuizResult | null;
    onComplete?: () => void;
}

function parseQuiz(value: string): QuizQuestion[] {
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
    } catch { /* noop */ }
    return [];
}

export default function QuizPlayer({ content, slug, lessonId, savedResult, onComplete }: Readonly<QuizPlayerProps>) {
    const questions = parseQuiz(content);
    const isAlreadySubmitted = !!savedResult;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number[]>>(() => {
        if (savedResult?.answers) {
            // Restore saved answers (keys may be strings from JSON)
            const restored: Record<number, number[]> = {};
            for (const [k, v] of Object.entries(savedResult.answers)) {
                restored[Number(k)] = v;
            }
            return restored;
        }
        return {};
    });
    const [results, setResults] = useState<QuizResult[] | null>(savedResult?.results || null);
    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);
    const [correctCount, setCorrectCount] = useState(savedResult?.correctCount || 0);
    const [checking, setChecking] = useState(!savedResult && !results);

    // On mount, if no savedResult, verify with server (cache may be stale)
    useEffect(() => {
        if (savedResult || results) {
            setChecking(false);
            return;
        }
        setChecking(true);
        let cancelled = false;
        courses.getQuizResult(slug, lessonId).then((data) => {
            if (cancelled) return;
            if (data.alreadySubmitted) {
                setResults(data.results);
                setCorrectCount(data.correctCount);
                const restored: Record<number, number[]> = {};
                for (const [k, v] of Object.entries(data.answers as Record<string, number[]>)) {
                    restored[Number(k)] = v;
                }
                setAnswers(restored);
            }
        }).catch(() => { /* noop */ }).finally(() => {
            if (!cancelled) setChecking(false);
        });
        return () => { cancelled = true; };
    }, [slug, lessonId, savedResult, results]);

    if (questions.length === 0) {
        return (
            <div className="p-6 bg-card border border-border rounded-xl text-center text-muted-foreground">
                No quiz questions available.
            </div>
        );
    }

    const submitted = results !== null;
    const question = questions[currentIndex];
    const selectedOptions = answers[currentIndex] || [];
    const answeredCount = Object.keys(answers).length;
    const allAnswered = answeredCount === questions.length;
    const isLastQuestion = currentIndex === questions.length - 1;
    const result = submitted ? results.find((r) => r.questionIndex === currentIndex) : null;

    const toggleOption = (oi: number) => {
        if (submitted || checking) return;
        setAnswers((prev) => {
            const current = prev[currentIndex] || [];
            const isSelected = current.includes(oi);
            const next = isSelected
                ? current.filter((i) => i !== oi)
                : [...current, oi];
            return { ...prev, [currentIndex]: next };
        });
    };

    const handleSubmit = async () => {
        if (!allAnswered || submittingRef.current || submitted || isAlreadySubmitted || checking) return;
        submittingRef.current = true;
        setSubmitting(true);
        try {
            const response = await courses.submitQuiz(slug, lessonId, answers);
            if (response.alreadySubmitted) {
                setResults(response.results);
                setCorrectCount(response.correctCount);
                if (response.answers) {
                    const restored: Record<number, number[]> = {};
                    for (const [k, v] of Object.entries(response.answers as Record<string, number[]>)) {
                        restored[Number(k)] = v;
                    }
                    setAnswers(restored);
                }
                return;
            }
            setResults(response.results);
            setCorrectCount(response.correctCount);
            const correct = response.correctCount ?? 0;
            const total = response.totalQuestions ?? questions.length;
            if (correct === total) {
                toast.success(`Quiz passed! ${correct}/${total} correct`);
            } else {
                toast.error(`Quiz completed: ${correct}/${total} correct`);
            }
            if (onComplete) {
                onComplete();
            }
        } catch {
            toast.error("Failed to submit quiz");
            submittingRef.current = false;
        } finally {
            setSubmitting(false);
        }
    };

    const goNext = () => {
        if (isLastQuestion) return;
        setCurrentIndex((i) => i + 1);
    };

    const goPrev = () => {
        if (currentIndex === 0) return;
        setCurrentIndex((i) => i - 1);
    };

    const passed = submitted && correctCount === questions.length;

    return (
        <div className="space-y-4">
            {/* Progress bar */}
            <div className="flex items-center gap-2">
                {questions.map((_, i) => {
                    const isAnswered = (answers[i]?.length || 0) > 0;
                    const isCurrent = i === currentIndex;
                    const qResult = submitted ? results?.find((r) => r.questionIndex === i) : null;

                    let bgClass = "bg-muted";
                    if (qResult) {
                        bgClass = qResult.isCorrect ? "bg-green-500" : "bg-destructive";
                    } else if (isCurrent) {
                        bgClass = "bg-primary";
                    } else if (isAnswered) {
                        bgClass = "bg-primary/40";
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-2 flex-1 rounded-full transition-colors cursor-pointer ${bgClass}`}
                            title={`Question ${i + 1}`}
                        />
                    );
                })}
            </div>

            {/* Question card */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                    {submitted ? (
                        <span className={`text-xs font-medium ${passed ? "text-green-500" : "text-destructive"}`}>
                            {correctCount}/{questions.length} correct{passed ? " — Passed!" : ""}
                        </span>
                    ) : (
                        <span className="text-xs text-muted-foreground">
                            {answeredCount}/{questions.length} answered
                        </span>
                    )}
                </div>

                <div className="p-5 space-y-4">
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                        {question.question}
                    </p>

                    {/* Options */}
                    <div className="space-y-2">
                        {question.options.map((opt, oi) => {
                            const isSelected = selectedOptions.includes(oi);

                            let optionClass = "border-border";
                            let iconEl = null;

                            if (submitted && result) {
                                const isCorrectOption = result.correctIndices.includes(oi);
                                const wasSelected = result.userAnswer.includes(oi);

                                if (isCorrectOption) {
                                    optionClass = "border-green-500 bg-green-500/5";
                                    iconEl = <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />;
                                } else if (wasSelected && !isCorrectOption) {
                                    optionClass = "border-destructive bg-destructive/5";
                                    iconEl = <XCircle className="w-4 h-4 text-destructive shrink-0" />;
                                }
                            } else if (isSelected) {
                                optionClass = "border-primary bg-primary/5";
                            } else {
                                optionClass = "border-border hover:border-primary/50 hover:bg-muted/30";
                            }

                            return (
                                <button
                                    key={oi}
                                    onClick={() => toggleOption(oi)}
                                    disabled={submitted || checking}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left text-sm transition-colors ${optionClass} ${
                                        submitted || checking ? "cursor-default" : "cursor-pointer"
                                    }`}
                                >
                                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs shrink-0 font-medium ${
                                        isSelected && !submitted ? "border-primary bg-primary text-primary-foreground" : "border-current"
                                    }`}>
                                        {String.fromCharCode(65 + oi)}
                                    </span>
                                    <span className="flex-1">{opt}</span>
                                    {iconEl}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Navigation & actions */}
            <div className="flex items-center justify-between">
                <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentIndex === 0
                            ? "text-muted-foreground cursor-not-allowed"
                            : "text-foreground hover:bg-muted cursor-pointer"
                    }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>

                {/* Right side: Next or Submit */}
                {isLastQuestion && !submitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!allAnswered || submitting || checking}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            allAnswered && !submitting && !checking
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                    >
                        {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Submit Quiz
                    </button>
                ) : (
                    <button
                        onClick={goNext}
                        disabled={isLastQuestion}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isLastQuestion
                                ? "text-muted-foreground cursor-not-allowed"
                                : "text-foreground hover:bg-muted cursor-pointer"
                        }`}
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
