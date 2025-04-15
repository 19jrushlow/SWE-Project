import * as ProgressTracker from "../services/progresstracker"

const path = require('path');

module.exports = {
	markProblem: (req, res)=>{
		const { userId, problemId } = req.body;
		let parsedUserId = parseInt(userId);
		console.log("Received api request to mark problem for user: " + parsedUserId + ", Problem: " + problemId);
		ProgressTracker.markUserProblemComplete(parsedUserId, problemId);
	}
}