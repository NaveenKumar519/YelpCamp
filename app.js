require('dotenv').config();
var express   =	require("express"),
    app		  = express(),
    bodyParser= require("body-parser"),
    mongoose  =	require("mongoose"),
	passport  = require("passport"),
	flash     = require("connect-flash"),
	LocalStrategy = require("passport-local"), 
	methodOverride= require("method-override"),
	Campground= require("./models/campground"),
	Comment   = require("./models/comment"),
	User      = require("./models/user");
	// seedDB    = require("./seeds");
// requiring routes
var campgroundsRoutes = require("./routes/campgrounds"),
	commentRoutes     = require("./routes/comments"),
    indexRoutes       = require("./routes/Index");
// seedDB(); //seeding the database
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost/yelp_camp_v12",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "This is a secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error     = req.flash("error");
	res.locals.success   = req.flash("success");
	next();
});
// Campground.create({
// 	name: "Justin Folley",
// 	image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 	description: "This is just some random text that doesn't have to do anything with the given campground"
// },function(err,campground){
// 	if(err)
// 		console.log(err);
// 	else{
// 		console.log("Newly created campground!");
// 		console.log(campground);
// 	}
// });

app.use(campgroundsRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT||3000,process.env.IP,function(){
		   console.log("YelpCamp Server has started");
	});