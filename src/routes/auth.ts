import bcrypt from "bcryptjs";
import express from "express";
import  Jwt  from "jsonwebtoken";
import { users } from "../db";

const SECRET_KEY ="omgite07"
const router = express.Router();


router.post("/signup",  async (req , res) =>{
    const {email , password , role, name } = req.body;
    if(!email || !password || !role || !name){
        return res.status(400).json({message: "Missing Field"})
    }

    const userExist = users.find((u => u.email === email));

    if (userExist){
        return res.status(409).json({message : "User already exist"});
    }

    const hashPassword = await bcrypt.hash(password , 10);
    const newUser = {
        id: users.length +1,
        email,
        password: hashPassword,
        role,
        name
    };
    users.push(newUser);

    const token =  Jwt.sign(
        {
            id: newUser.id ,
            role: newUser.role,
        },
        SECRET_KEY
    )

    res.status(200).json({message:"User is created", token})
})

router.post("/login" , async (req,res) =>{
    const {email , password } = req.body;
    if(!email || !password ){
        return res.status(400).json({message: "Missing Field"})
    }

    const findUser = users.find( (u => u.email === email));
    if(!findUser){
        return res.status(403).json({message:"Invalid credentials"});
    };
    
    const isMatch = await bcrypt.compare(password ,findUser.password);
    if(!isMatch){
        return res.status(403).json({message:"Invalid credentials"});
    };

    const token =  Jwt.sign(
        {
            id: findUser.id ,
            role: findUser.role,
        },
        SECRET_KEY
    )
      res.json({token})

})
export default router;
