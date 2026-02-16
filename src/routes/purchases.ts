import express from "express";
import {type Request, type Response} from "express";
import { authMiddleware } from "../middleware/authmiddleware";
import { purchases, courses } from "../db";

const router = express.Router();

//BUY course

router.post("/", authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "student" && user.role !== "STUDENT") {
    return res.status(403).json({ message: "Only students can purchase courses" });
  }

  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: "Course ID required" });
  }

  // Check already purchased
  const alreadyPurchased = purchases.find(
    p => p.courseId === Number(courseId) && p.studentId === user.id
  );

  if (alreadyPurchased) {
    return res.status(409).json({ message: "Course already purchased" }); // Changed to 409 as per test
  }
  
  // Verify course exists
  const course = courses.find(c => c.id === Number(courseId));
  if (!course) {
      return res.status(404).json({ message: "Course not found" });
  }

  const newPurchase = {
    id: purchases.length + 1,
    courseId: Number(courseId),
    studentId: user.id
  };

  purchases.push(newPurchase);

  res.status(200).json(newPurchase); // Changed to 200 as per test expectation (or stay 201 if test accepts it - test expected 200/409)
});

//GET MY PURCHASES (kept for compatibility if needed, but test uses users/:id/purchases)
router.get("/", authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "student" && user.role !== "STUDENT") {
    return res.status(403).json({ message: "Only students can view purchases" });
  }

  const myPurchases = purchases.filter(
    p => p.studentId === user.id
  );

    // Join with course details
    const result = myPurchases.map(p => {
        const course = courses.find(c => c.id === p.courseId);
        return {
            ...p,
            course
        };
    });

  res.json(result);
});

export default router;