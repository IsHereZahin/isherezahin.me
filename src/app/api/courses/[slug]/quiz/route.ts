import { auth } from "@/auth";
import { CourseModel, EnrollmentModel } from "@/database/models/course-model";
import dbConnect from "@/database/services/mongo";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ slug: string }>;
}

interface QuizQuestion {
    question: string;
    options: string[];
    correctIndices: number[];
    // Legacy support
    correctIndex?: number;
}

// GET: Check if quiz was already submitted for a lesson
export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { slug } = await params;
        const lessonId = req.nextUrl.searchParams.get("lessonId");

        if (!lessonId) {
            return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
        }

        const course = await CourseModel.findOne({ slug }).lean() as { _id: unknown };
        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const enrollment = await EnrollmentModel.findOne({
            userId: session.user.id,
            courseId: course._id,
        });
        if (!enrollment) {
            return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
        }

        const savedResult = enrollment.quizResults?.get(lessonId);
        if (savedResult) {
            // Explicitly extract properties — spread may fail on Mongoose Map values
            return NextResponse.json({
                results: savedResult.results,
                correctCount: savedResult.correctCount,
                totalQuestions: savedResult.totalQuestions,
                passed: savedResult.passed,
                answers: savedResult.answers,
                alreadySubmitted: true,
            });
        }

        return NextResponse.json({ alreadySubmitted: false });
    } catch (error) {
        console.error("Error checking quiz status:", error);
        return NextResponse.json({ error: "Failed to check quiz status" }, { status: 500 });
    }
}

// POST: Submit quiz answers and get results (server-side validation, one-time only)
export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { slug } = await params;
        const body = await req.json();
        const { lessonId, answers } = body;

        if (!lessonId || !answers || typeof answers !== "object") {
            return NextResponse.json(
                { error: "lessonId and answers are required" },
                { status: 400 }
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const course = await CourseModel.findOne({ slug }).lean() as any;
        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        // Check enrollment
        const enrollment = await EnrollmentModel.findOne({
            userId: session.user.id,
            courseId: course._id,
        });
        if (!enrollment) {
            return NextResponse.json(
                { error: "Not enrolled in this course" },
                { status: 403 }
            );
        }

        // Check if already submitted
        const existingResult = enrollment.quizResults?.get(lessonId);
        if (existingResult) {
            return NextResponse.json({
                results: existingResult.results,
                correctCount: existingResult.correctCount,
                totalQuestions: existingResult.totalQuestions,
                passed: existingResult.passed,
                answers: existingResult.answers,
                alreadySubmitted: true,
            });
        }

        // Find the quiz lesson
        let quizContent: string | null = null;
        for (const mod of course.modules || []) {
            for (const lesson of mod.lessons || []) {
                if (lesson._id.toString() === lessonId && lesson.contentType === "quiz") {
                    quizContent = lesson.content;
                    break;
                }
            }
            if (quizContent) break;
        }

        if (!quizContent) {
            return NextResponse.json(
                { error: "Quiz lesson not found" },
                { status: 404 }
            );
        }

        // Parse quiz questions
        let questions: QuizQuestion[];
        try {
            questions = JSON.parse(quizContent);
            if (!Array.isArray(questions)) {
                throw new Error("Invalid quiz format");
            }
        } catch {
            return NextResponse.json(
                { error: "Invalid quiz data" },
                { status: 500 }
            );
        }

        // Validate answers and compute results
        const results = questions.map((q, i) => {
            const userAnswer: number[] = Array.isArray(answers[i]) ? answers[i] : [];
            const correct = Array.isArray(q.correctIndices)
                ? q.correctIndices
                : typeof q.correctIndex === "number"
                    ? [q.correctIndex]
                    : [0];

            const userSorted = [...userAnswer].sort((a, b) => a - b);
            const correctSorted = [...correct].sort((a, b) => a - b);
            const isCorrect =
                userSorted.length === correctSorted.length &&
                userSorted.every((v, idx) => v === correctSorted[idx]);

            return {
                questionIndex: i,
                isCorrect,
                correctIndices: correct,
                userAnswer,
            };
        });

        const correctCount = results.filter((r) => r.isCorrect).length;
        const totalQuestions = questions.length;
        const passed = correctCount === totalQuestions;

        // Store quiz result in enrollment
        const quizResult = { results, correctCount, totalQuestions, passed, answers, submittedAt: new Date() };
        enrollment.quizResults = enrollment.quizResults || new Map();
        enrollment.quizResults.set(lessonId, quizResult);
        enrollment.markModified("quizResults");
        await enrollment.save();

        return NextResponse.json({
            results,
            correctCount,
            totalQuestions,
            passed,
        });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        return NextResponse.json(
            { error: "Failed to submit quiz" },
            { status: 500 }
        );
    }
}
