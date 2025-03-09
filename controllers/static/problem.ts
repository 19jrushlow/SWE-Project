interface Problem {
    title: string;
    content: string;
}

loadProblem();

async function loadProblem() {
	const urlParams = new URLSearchParams(window.location.search);
	const problemID = urlParams.get('problemID');
	
	if (problemID) {
		try {
			const response = await fetch('/problems.json');
			
			if (!response.ok) {
				throw new Error('Failed to fetch problems.json');
			}
			
			const data = await response.json();
			
			const problem: Problem = data[problemID];
			
			document.getElementById('title').innerHTML = problem.title;
			document.getElementById('content').innerHTML = problem.content;
		} catch (error) {
			console.error('Error loading data:', error);
		}
	} else {
		console.error('No problemID in the URL path');
	}
}