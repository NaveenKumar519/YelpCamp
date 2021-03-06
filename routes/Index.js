var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
router.get("/",function(req,res){
	res.render("landing");
});


// ====================
// AUTH ROUTES
// =====================
// shows register form
router.get("/register",function(req,res){
	res.render("register",{page: "register"});
});
//handle sign up logic
router.post("/register",function(req,res){
	
	var newUser= new User({username: req.body.username,email: req.body.email,firstName: req.body.firstName,lastName: req.body.lastName,avatar: req.body.avatar});
	if(req.body.adminCode === "secretCode@123"){
		newUser.isAdmin = true;
	}
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			 return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to YelpCamp "+user.username);
			// console.log(newUser);
			res.redirect("/campgrounds");
		});
	});
});
//show login form
router.get("/login",function(req,res){
	res.render("login",{page: "login"});
});
//handling login logic
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"

}),function(req,res){
	
});
//logout route
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/campgrounds");
});


// User's Profile
router.get("/users/:id",function(req,res){
	User.findById(req.params.id,function(err,foundUser){
		if(err){
			req.flash("error","User doesn't exist");
			res.redirect("back");
		}else{
			
			Campground.find().where("author.id").equals(foundUser._id).exec(function(err,campgrounds){
				if(err){
					req.flash("error","Something Went wrong");
					res.redirect("back");
				}
				else{
					res.render("users/show",{user: foundUser,campgrounds: campgrounds});	
				}
			});
			
		}
	})
});
module.exports = router;