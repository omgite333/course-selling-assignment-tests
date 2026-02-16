import express from "express";
import { type Request , type Response } from "express";
import { authMiddleware } from "../middleware/authmiddleware";
import { courses, lessons } from "../db";

const router = express.Router();


// Create course only instructor
router.post("/" , authMiddleware ,(req:Request , res: Response) =>{
    const user = (req as any).user ; 
    if(user.role !== "instructor" && user.role !== "INSTRUCTOR"){ // Handle case sensitivity if needed, checking test sends "INSTRUCTOR"
        return res.status(403).json({message:"Only instructor can create a course"})
    }

    const { title , description , price } =req.body;

    if( !title || !description || !price){
        return res.status(400).json({ message: "Missing filed"})
    }

    const newCourse ={
        id: courses.length+1,
        title,
        description,
        price,
        instructorId : user.id,
    }

    courses.push(newCourse)

    res.status(200).json(newCourse);
})

// Get All courses

router.get("/" , (req: Request,res : Response) =>{
    res.json(courses)
})

// Get lessons for a course
router.get("/:id/lessons", (req: Request, res: Response) => {
    const courseId = Number(req.params.id);
    const courseLessons = lessons.filter(l => l.courseId === courseId);
    res.json(courseLessons || []);
});

// Get Courses by id

router.get("/:id" , (req: Request,res : Response) =>{
    const id = Number(req.params.id);
    const course = courses.find(c => c.id === id);

    if(!course){
        return res.status(404).json({message :"Course Not Found"})
    }

    res.json(course);
})

router.patch("/:id" , authMiddleware , (req:Request , res: Response) =>{
    const user  =(req as any).user;
    
    if(user.role !== "instructor" && user.role !== "INSTRUCTOR"){
        return res.status(403).json({message:"Only instructor can create a course"})
    }

    const id = Number(req.params.id);
    const course = courses.find(c=> c.id === id);


    if(!course){
        return res.status(404).json({message:"Course not found"})
    }

    if(course.instructorId !== user.id){
        return res.status(403).json({message:"Not Authorised"})
    }

    const { title , description , price} = req.body;

    if(title) course.title = title;
    if(description) course.description = description;
    if(price) course.price = price;

    res.json(course);

})

router.delete("/:id", authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "instructor" && user.role !== "INSTRUCTOR") {
    return res.status(403).json({ message: "Only instructors can delete courses" });
  }

  const id = Number(req.params.id);
  const index = courses.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Course not found" });
  }

  if (courses[index].instructorId !== user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  courses.splice(index, 1);

  res.json({ message: "Course deleted" });
});

export default router;