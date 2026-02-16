import jwt  from "jsonwebtoken";
import {type Request , type Response , type NextFunction} from "express"
const SECRET_KEY  = "omgite07"

export const authMiddleware  = (
    req : Request, 
    res : Response,
    next: NextFunction) =>{
     const header  = req.headers.authorization;
     if(!header){
        return res.status(401).json({message: "No Token Provided"})
     }
     const token = header.split(" ")[1];

     try{
        const decoded = jwt.verify(token, SECRET_KEY);
        (req as any).user = decoded; 
        next();
     } catch(error){
        return res.status(401).json({message: "Invalid Token"});
     }
};