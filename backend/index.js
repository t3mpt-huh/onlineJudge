const express = require('express');
const app = express();
const {DBConnection} = require('./database/db.js');
const User = require('./models/Users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
dotenv.config();

//middldewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

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

app.post('/login',async (req,res)=>{
    try {
        //get all details from frontend
        const {email,password} = req.body;

        //validating user
        if(!(email && password)){
            return res.status(400).send('Fill all details');
        }

        //find user in database
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).send('No such user exists');
        }

        //match password
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(400).send('Wrong password');
        }
        //password matches hence we reach here -> now use jwt
        const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{
            expiresIn:'1h'
        });
        user.token = token;
        user.password = undefined;

        //section for cookies -> sending token in user cookie
        const options = {
            expires : new Date(Date.now() + 3*24*60*60*60*1000),
            httpOnly : true
        };
        res.status(200).cookie("token", token, options).json({
            success : true,
            token,
            user
        });
        
    } catch (error) {
        //console.log('galat hai aap');
        console.log(error.message);
    }
})

app.listen(8000,()=>{
    console.log("Server running on port: 8000");
});
