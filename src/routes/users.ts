import express from "express";
import { type Request, type Response } from "express";
import { authMiddleware } from "../middleware/authmiddleware";
import { purchases, courses, users } from "../db";

const router = express.Router();

router.get("/:id/purchases", authMiddleware, (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const user = (req as any).user;

    if (user.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
    }

    const userPurchases = purchases.filter(p => p.studentId === userId);

    const result = userPurchases.map(p => {
        const course = courses.find(c => c.id === p.courseId);
        return {
            ...p,
            course
        };
    });

    res.json(result);
});

export default router;
