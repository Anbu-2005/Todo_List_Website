import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60
    })
}

//login user
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message: "Please enter all fields"})
        }
        const user = await userModel.findOne({email})

        if(!user){
            return res.status(400).json({message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"})
        }
        const token = createToken(user._id)
        res.status(200).json({user,token})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
// const googleLogin = async (req, res) => {
//   try {
//     const { token } = req.body;

//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const { email, name } = ticket.getPayload();

//     let user = await userModel.findOne({ email });

//     if (!user) {
//       user = await userModel.create({
//         name,
//         email,
//         password: "GOOGLE_AUTH", // dummy password
//       });
//     }

//     const jwtToken = createToken(user._id);
//     res.status(200).json({ user, token: jwtToken });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Google login failed" });
//   }
// };
//register user
const registerUser = async (req,res) => {
    const {name, email, password} = req.body;
    try{
        //check if user already exists
        const exists = await userModel.findOne({email})
        if(exists){
            return res.status(400).json({message: "User already exists"})
        }
        if (validator.isEmpty(name) || validator.isEmpty(email) || validator.isEmpty(password)) {
            return res.status(400).json({message: "Please enter all fields"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message: "Please enter a valid email"})
        }
        if(!validator.isStrongPassword(password)){
            return res.status(400).json({message: "Please enter a strong password"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({name, email, password: hashedPassword})
        const user = await newUser.save()
        const token = createToken(user._id)
        res.status(200).json({user,token})

    } catch(error){
        res.status(500).json({message: error.message})
    }
}

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google id token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    // Find or create user
    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({
        name,
        email,
        password: "GOOGLE_AUTH", // dummy password or random string
      });
    }

    // Create your own JWT token for your app
    const jwtToken = createToken(user._id);

    return res.status(200).json({ user, token: jwtToken });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Google login failed" });
  }
};

//get user info
const getUser = async (req,res) => {
    const id = req.user.id
    try{
        const user = await userModel.find({_id:id})
        res.status(200).json({user: user[0]})
    } catch(error){
        res.status(502).json({message: error.message})
    }
}
export {loginUser, registerUser, getUser,googleLogin}
