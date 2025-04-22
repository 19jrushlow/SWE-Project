import * as AttemptManager from "../services/attempts"

const path = require('path');

module.exports = {
	saveAttempt: async (req, res)=>{
		const { userId, pageId, userContent, language, input } = req.body;
		let parsedUserId = parseInt(userId);
		console.log("Received api request to save attempt for user: " + parsedUserId + ", Problem: " + pageId);
		
		await AttemptManager.saveAttempt(userId, pageId, userContent, language, input)
	},

	loadAttempt: async (req, res)=>{
		const { userId, pageId } = req.body;
		let parsedUserId = parseInt(userId);
		console.log("Received api request to load attempt for user: " + parsedUserId + ", Problem: " + pageId);
		try {
			let attempt = await AttemptManager.loadAttempt(userId, pageId)

			// Send the result back
			res.json({
				success: true,
				message: "Leaders fetched successfully.",
				attempt: attempt
			});
		} catch (error) {
			console.error("Error while fetching attempt:", error);
			
			// Handle the error
			res.status(500).json({
				success: false,
				message: "There was an error fetching attempt.",
				error: error.message
			});
		}
	}
}