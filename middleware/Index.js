var Campground = require("../models/campground");
var Comment    = require("../models/comment");
// all middleware goes here
var middlewareObj = {};
middlewareObj.checkCommentsOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}
			else{
				if(!foundComment){
				req.flash("error","Item not found");
				return res.redirect("back");
			}
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error","You must be signed in to do that");
		res.redirectd("back");
	}

}
middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You must be signed in to do that");
	res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
	// is user logged in ?
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			req.flash("error","Campground not found");
			res.redirect("back");
		}
		else{
			if(!foundCampground){
				req.flash("error","Item not found");
				return res.redirect("back");
			}
			//does the user own the campground
			if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
				next();	
			}else{
				req.flash("error","You don't have permission to do that!");
				res.redirect("back");
			}
		}
	});
	}else{
		req.flash("error","You must be signed in to do that");
		res.redirect("back");
	}	
}
	
module.exports = middlewareObj;