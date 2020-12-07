var mongoose = require("mongoose");
//SCHEMA SETUP
var campgroundSchema=new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	],
	createdAt: {
		type: Date,
		default: Date.now
	},
	author: {
		id: mongoose.Schema.Types.ObjectId,
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
});
//Compiling into a mode
module.exports = mongoose.model("Campground",campgroundSchema);