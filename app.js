require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});

//modified schema from JS object to new mongoose schema object.
const userSchema = new mongoose.Schema ({
  email : String,
  password : String
});

//creating a plugin . always place before modeling database

userSchema.plugin(encrypt , {secret : process.env.SECRET , encryptedFields : ["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
  res.render("home");
});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.get("/register",(req,res)=>{
  res.render("register");
});

//post request from register page.
app.post("/register",(req,res)=>{

  const newUser = new User({
    email : req.body.username,
    password : req.body.password
  });

  newUser.save(function(err){
    if(err) console.log(err);
    else res.render("secrets");
  });

});

//post request from login page
app.post("/login",(req,res)=>{
  const usename = req.body.username;
  const passcode = req.body.password;

  User.findOne({email:usename},function(err,foundUser){
    if(err) console.log(err);
    else{
      if(foundUser.password === passcode){
        res.render("secrets");
      }
    }
  });

});

app.listen(process.env.PORT || 3000,()=>{
  console.log("Server running on port 3000");
});
