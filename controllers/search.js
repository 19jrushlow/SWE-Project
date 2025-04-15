import * as Search from "../services/search"

const path = require('path');

module.exports = {
	findProblems: async (req, res)=>{
		const { searchString, statusFilter, categoryFilter, difficultyFilter, userId } = req.body;
		userId = parseInt(userId);
		console.log("Search API request made for: " + searchString + " " + statusFilter + " " + categoryFilter + " " + difficultyFilter);

		if (userId == -1) { console.log("Guest making a search"); }
		
		try {
			// Make the API call to get the problems based on the filters
			const problemMatches = await Search.findProblems(searchString, statusFilter, categoryFilter, difficultyFilter, userId);
	  
			// Send the result back
			res.json({
				success: true,
				message: "Problems fetched successfully.",
				problemMatches: problemMatches
			});
		} catch (error) {
			console.error("Error while fetching problems:", error);
			
			// Handle the error
			res.status(500).json({
				success: false,
				message: "There was an error fetching problems.",
				error: error.message
			});
		}
	}
}