const path = require('path');

module.exports = {
	getPage: (req, res)=>{
		res.sendFile(path.join( __dirname, "..", 'views', 'leaderboard.html'));
	}
}