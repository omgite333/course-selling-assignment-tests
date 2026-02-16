import express from "express";
import { type Request, type Response } from "express";
import { authMiddleware } from "../middleware/authmiddleware";
import { lessons, courses } from "../db";

const router = express.Router();

router.post("/", authMiddleware, (req: Request, res: Response) => {
    const user = (req as any).user;
    if (user.role !== "instructor" && user.role !== "INSTRUCTOR") {
        return res.status(403).json({ message: "Only instructors can create lessons" });
    }

    const { title, content, courseId } = req.body;

    if (!title || !content || !courseId) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const course = courses.find(c => c.id === Number(courseId));
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructorId !== user.id) {
        return res.status(403).json({ message: "Not authorized to add lessons to this course" });
    }

    const newLesson = {
        id: lessons.length + 1,
        title,
        content,
        courseId: Number(courseId)
    };

    lessons.push(newLesson);

    res.status(200).json(newLesson);
});

export default router;
