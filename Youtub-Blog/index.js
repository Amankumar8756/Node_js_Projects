const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
require("dotenv").config();
console.log("MongoDB URI:", process.env.URI);
// app.use(express.static("public"));


// const MONGO_URL=require("./.env")


const blogRoute = require("./routes/blog");
const cookieParser = require('cookie-parser');

const Blog = require('./models/blog');

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express(); 
const PORT = process.env.PORT || 5000;

// MongoDB Connection  
mongoose
  .connect(process.env.URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Template Engine Setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
// app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(  checkForAuthenticationCookie ("token")); 
app.use(express.static(path.resolve("./public")));
// Routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
     blogs: allBlogs, 
  });
});
app.use("/user", userRoute); 
app.use("/blog", blogRoute); 


// Start Server
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`)); 