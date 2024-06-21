const express = require('express');
const app = express();
const {DBConnection} = require('./database/db.js');
const User = require('./models/Users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

//middldewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//connect to database
DBConnection();

app.get("/",(req,res)=>{
    res.send("welcome to the online judge");
});
app.post("/register",async (req,res)=>{
    console.log(req);
    try{
        const {firstname,lastname,email,password} = req.body;
        //check if all the details have been filled by the user
        if(!(firstname && lastname && email && password)){
            return res.status(400).send("Please fill all the details");
        }
        //check if email has already been used
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).send("User already exists");
        }
        // encrypt password
        const hashPassword = bcrypt.hashSync(password,10);
        const user = await User.create({
           firstname,
           lastname,
           email,
           password: hashPassword
        });
        // since we are using env again we will import write const dotenv statement again
        const token = jwt.sign({id:user._id,email},process.env.SECRET_KEY, {
            expiresIn: "1h"
        });
        user.token = token;
        user.password = undefined;
        res.status(201).json({
            message: "You have successfully registered",
            user
        });

    }catch(error){
        console.error(error);
    }
});
app.listen(8000,()=>{
    console.log("Server running on port: 8000");
});