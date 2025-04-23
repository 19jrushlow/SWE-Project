const { exec } = require('child_process');
const path = require('path');

module.exports = {
	runCode: async (req, res)=>{
		const { request, executionURL } = req.body;
		console.log("Received api request to compile: " + request.source + " " + executionURL);
	
		try {
			let response = await fetch(executionURL, 
				{
					method: "POST",
					body: JSON.stringify(request),
					headers: {"Content-type": "application/json"},
				})
		
				if (response.ok) {
					let data = await response.text()
					console.log(data)
					res.send(data)
				}
		} catch {
			console.log("Compilation error!")
		}
	}
}