const path = require('path');

module.exports = {
	// render problem page
	getPage: (req, res)=>{
		res.sendFile(path.join( __dirname, "..", 'views', 'sandbox.html'));
	}
}