import * as ProgressTracker from "../services/progresstracker"

const path = require('path');

module.exports = {
	markProblem: (req, res)=>{
		const { userId, problemId } = req.body;
		userId = parseInt(userId);
		console.log("Received api request to mark problem for user: " + userId + ", Problem: " + problemId);
		ProgressTracker.markUserProblemComplete(userId, problemId);
	}
}