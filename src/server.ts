import express from "express";
import coursesRoutes from "./routes/courses";
import purchasesRoutes from "./routes/purchases";
import authRoutes from "./routes/auth";
import lessonsRoutes from "./routes/lessons";
import usersRoutes from "./routes/users";
import { authMiddleware } from "./middleware/authmiddleware";
import { users } from "./db";

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/courses" , coursesRoutes);
app.use("/purchases", purchasesRoutes);
app.use("/lessons", lessonsRoutes);
app.use("/users", usersRoutes);

app.get("/me", authMiddleware, (req, res) => {
    const userId = (req as any).user.id;
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
});

export default app;