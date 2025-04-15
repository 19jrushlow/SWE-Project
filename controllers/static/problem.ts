interface Problem {
	title: string;
	tags: string[];
	content: string;
	tests: {
		inputs: string[];
		outputs: string[];
	};
	solution: {
		lang: string;
		code: string;
		explanation: string;
	}
}

if(window.location.pathname == '/problem') {
	loadProblem();
}
fetchIDE();


async function loadProblem() {
	const urlParams = new URLSearchParams(window.location.search);
	const problemID = urlParams.get('problemID');
	
	if (problemID) {
		try {
			// fetch problem from problems.json
			const response = await fetch('/problems.json');
			
			if (!response.ok) {
				throw new Error('Failed to fetch problems.json');
			}
			
			const data = await response.json();
			
			const problem: Problem = data[problemID];
			
			document.getElementById('title').innerHTML = problem.title;
			document.getElementById('content').innerHTML = problem.content;
			document.getElementById('tags').innerHTML = problem.tags.join(', ');
			
			// add test cases
			const table = document.getElementById('test-case-table') as HTMLElement;
			
			for (let i = 0; i < problem.tests.inputs.length; i++) {
				const row = document.createElement('tr');

				const inputCell = document.createElement('td');
				inputCell.textContent = problem.tests.inputs[i];

				const expectedOutputCell = document.createElement('td');
				expectedOutputCell.textContent = problem.tests.outputs[i];

				row.appendChild(inputCell);
				row.appendChild(expectedOutputCell);
				row.appendChild(document.createElement('td'));

				table.appendChild(row);
			}
			
			// insert solution
			const solutionDiv = document.getElementById("solution");
			if (solutionDiv) {
				const langElement = document.createElement("p");
				langElement.textContent = problem.solution.lang;
				solutionDiv.appendChild(langElement);
				
				const codeElement = document.createElement("pre");
				codeElement.textContent = problem.solution.code;
				solutionDiv.appendChild(codeElement);
				
				const explanationElement = document.createElement("pre");
				explanationElement.id = "explanation";
				explanationElement.textContent = problem.solution.explanation;
				solutionDiv.appendChild(explanationElement);
			}
			
		} catch (error) {
			console.error('Error loading data:', error);
		}
	} else {
		console.error('No problemID in the URL path');
	}
}

function revealSolution() {
	const element = document.getElementById('solution');
	element.style.display = 'block';
}

async function fetchIDE() {
	try {
		const response = await fetch('/IDE');
		
		if (!response.ok) {
			throw new Error('Failed to load the second HTML page');
		}
		
		const htmlContent = await response.text();
		
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = htmlContent;
		
		const ideContent = tempDiv.querySelector('#ide');
		
		if (ideContent) {
			const ideContainer = document.getElementById('ide');
			if (ideContainer) {
				ideContainer.innerHTML = ideContent.innerHTML;
			}
		}
		loadIDEScripts();
	} catch (error) {
		console.error('Error fetching IDE content:', error);
	}
}

function loadIDEScripts() {
    const aceScript = document.createElement('script');
	const ideScript = document.createElement('script');
	
    aceScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js';
	aceScript.onload = () => {
		ideScript.src = 'IDE.js';
		ideScript.onerror = (error) => {
			console.error('Failed to load IDE.js:', error);
		};
	}
    aceScript.onerror = (error) => {
        console.error('Failed to load ace.js:', error);
    };
	
	const ide = document.getElementById('ide');
    ide.appendChild(aceScript);
	ide.appendChild(ideScript);
}