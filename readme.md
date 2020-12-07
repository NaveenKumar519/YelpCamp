RESTFUL ROUTES 
name    url    	  		  verb   desc
===============================================================
INDEX  /campgrounds   	  GET    Display a list of all campgrounds
NEW    /campgrounds/new   GET    Display a form to make new campground
CREATE /campgrounds       POST   ADD new campground
SHOW   /campgrounds/:id   GET    Shows info about campground

NESTED ROUTES
NEW    /campgrounds/:id/comments/new  GET
CREATE campgrounds/:id/comments       POST