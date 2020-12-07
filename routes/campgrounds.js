var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware/Index");

//INDEX-show all campgrounds
router.get("/campgrounds",function(req,res){
	var noMatch= null;
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name: regex},function(err,allCampgrounds){
		if(err)
			console.log(err);
		else{
			
			if(allCampgrounds.length< 1){
				noMatch = "No campgrounds match that query, please try again";
				
			}
			// console.log(allCampgrounds[0].comments);
			res.render("campgrounds/Index",{campgrounds: allCampgrounds,page: "campgrounds",noMatch: noMatch});	
			
		}
	});
	}else{
		//Get all campgrounds from DB
	Campground.find({},function(err,allCampgrounds){
		if(err)
			console.log(err);
		else{
			// console.log(allCampgrounds[0].comments);
			res.render("campgrounds/Index",{campgrounds: allCampgrounds,page: "campgrounds",noMatch: noMatch});	
		}
	});
	}
	
	
});
//CREATE-add new to the database
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
	//get data to form and to array
	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var price= req.body.price;
	var author= {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground={name:name,image:image, description: description,price: price,author: author};
	//Create a new campground and save it to database
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
	
});
//NEW-show form to create new campground
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});
//Show-shows more info about one campground
router.get("/campgrounds/:id",function(req,res){
	
	Campground.findById(req.params.id).populate("comments likes").exec(function(err,foundCampground){
    // Campground.findById((req.params.id),function(err,foundCampground){
		if(err)
			console.log(err);
		else{
			if(!foundCampground){
				req.flash("error","Item not found");
				return res.redirect("back");
			}
			//render the show template
			// console.log(foundCampground);
			// console.log(foundCampground);
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
	
});
// EDIT ROUTE
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	// is user logged in ?
	
		Campground.findById(req.params.id,function(err,foundCampground){
			if(!foundCampground){
				req.flash("error","Item not found");
				return res.redirect("back");
			}
			res.render("campgrounds/edit",{campground: foundCampground});
		
	});
	
	
	
});
// UPDATE ROUTE
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	//find and update the correct campground
	
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
	//redirect somewhere(show page)
});
// DESTROY ROUTE
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("back");
		}
	});
});
// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }
// function checkCampgroundOwnership(req,res,next){
// 	// is user logged in ?
// 	if(req.isAuthenticated()){
// 		Campground.findById(req.params.id,function(err,foundCampground){
// 		if(err){
// 			res.redirect("back");
// 		}
// 		else{
// 			//does the user own the campground
// 			if(foundCampground.author.id.equals(req.user._id)){
// 				next();	
// 			}else{
// 				res.redirect("back");
// 			}
// 		}
// 	});
// 	}else{
// 		res.redirect("back");
// 	}
	
	
// }
// Campground like Route
router.post("/campgrounds/:id/like",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
			req.flash("error","Oops,something went wrong!!");
			return res.redirect("/campgrounds");
		}
		// check if req.user._id exists in foundcampground.likes
		var foundUserLike = foundCampground.likes.some(function(like){
			return like.equals(req.user._id);
		});
		if(foundUserLike){
			foundCampground.likes.pull(req.user._id);
		}else{
			foundCampground.likes.push(req.user);
		}
		foundCampground.save(function(err){
			if(err){
				console.log(err);
				req.flash("error","Oops,something went wrong!!");
				return res.redirect("/campgrounds");
			}
			return res.redirect("/campgrounds/"+foundCampground._id);
		});
	});
});
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;