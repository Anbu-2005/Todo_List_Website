// controllers/taskController.js
import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = (email, subject, title, description) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "anbarasan22cs@gmail.com",
    to: email,
    subject,
    html: `<h1>Task added successfully</h1><h2>Title: ${title}</h2><h3>Description: ${description}</h3> 
     <img src="https://i.pinimg.com/736x/51/81/9c/51819c0566eb155d5f90f9d4967da4ee.jpg" alt="Task Banner" width="400"/>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log("Email sent: " + info.response);
  });
};

const addTask = async (req, res) => {
  const { title, description,dueDate } = req.body;
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newTask = new taskModel({ title, description, dueDate,completed: false, userId });
    const savedTask = await newTask.save();

    sendMail(user.email, "Task Added", title, description);

    return res.status(200).json(savedTask); // send saved task with _id
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeTask = async (req, res) => {
  const { id } = req.params;
  try {
    await taskModel.findOneAndDelete({ _id: id, userId: req.user.id });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const tasks = await taskModel.find({ userId: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTask = await taskModel.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
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

export { addTask, getTask, removeTask, updateTask };
