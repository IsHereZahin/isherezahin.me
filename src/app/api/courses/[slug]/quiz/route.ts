import { auth } from "@/auth";
import { CourseModel } from "@/database/models/course-model";
import { LessonModel } from "@/database/models/lesson-model";
import { EnrollmentModel } from "@/database/models/enrollment-model";
import { QuizResultModel } from "@/database/models/quiz-result-model";
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

        const course = await CourseModel.findOne({ slug }).lean() as { _id: unknown } | null;
        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const enrollment = await EnrollmentModel.findOne({
            userId: session.user.id,
            courseId: course._id,
        }).lean() as { _id: unknown } | null;
        if (!enrollment) {
            return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
        }

        const savedResult = await QuizResultModel.findOne({
            enrollmentId: enrollment._id,
            lessonId,
        }).lean() as Record<string, unknown> | null;

        if (savedResult) {
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

        const course = await CourseModel.findOne({ slug }).lean() as { _id: unknown } | null;
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
        }).lean() as { _id: unknown } | null;
        if (!enrollment) {
            return NextResponse.json(
                { error: "Not enrolled in this course" },
                { status: 403 }
            );
        }

        // Check if already submitted
        const existingResult = await QuizResultModel.findOne({
            enrollmentId: enrollment._id,
            lessonId,
        }).lean() as Record<string, unknown> | null;

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

        // Find the quiz lesson from the Lesson collection
        const quizLesson = await LessonModel.findOne({
            _id: lessonId,
            courseId: course._id,
            contentType: "quiz",
        }).lean() as { content: string } | null;

        if (!quizLesson?.content) {
            return NextResponse.json(
                { error: "Quiz lesson not found" },
                { status: 404 }
            );
        }

        // Parse quiz questions
        let questions: QuizQuestion[];
        try {
            questions = JSON.parse(quizLesson.content);
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

        // Atomically insert quiz result — unique index on (enrollmentId, lessonId) prevents duplicates
        try {
            await QuizResultModel.create({
                enrollmentId: enrollment._id,
                lessonId,
                answers,
                results,
                correctCount,
                totalQuestions,
                passed,
                submittedAt: new Date(),
            });
        } catch (err: unknown) {
            // Duplicate key error (race condition) — return existing result
            if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000) {
                const saved = await QuizResultModel.findOne({
                    enrollmentId: enrollment._id,
                    lessonId,
                }).lean() as Record<string, unknown> | null;
                return NextResponse.json({
                    results: saved?.results ?? results,
                    correctCount: saved?.correctCount ?? correctCount,
                    totalQuestions: saved?.totalQuestions ?? totalQuestions,
                    passed: saved?.passed ?? passed,
                    answers: saved?.answers ?? answers,
                    alreadySubmitted: true,
                });
            }
            throw err;
        }

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
