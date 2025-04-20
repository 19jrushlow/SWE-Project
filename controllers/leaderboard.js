import * as LeaderboardService from "../services/leaderboard"

const path = require('path');

module.exports = {
	getPage: (req, res)=>{
		res.sendFile(path.join( __dirname, "..", 'views', 'leaderboard.html'));
	},

	getLeaders: async (req, res)=>{
		const { topFilter, dateFilter, userId } = req.body;
		let parsedUserId = parseInt(userId);
		console.log("Leaderboard API request made for: " + topFilter + " " + dateFilter);

		if (parsedUserId == -1) { console.log("Guest viewing leaderboard."); }
		
		try {
			// Make the API call to get the problems based on the filters
			let leaders = await LeaderboardService.getLeaders(topFilter, dateFilter, parsedUserId)
	  
			// Send the result back
			res.json({
				success: true,
				message: "Leaders fetched successfully.",
				leaders: leaders
			});
		} catch (error) {
			console.error("Error while fetching problems:", error);
			
			// Handle the error
			res.status(500).json({
				success: false,
				message: "There was an error fetching leaders.",
				error: error.message
			});
		}
	}
}