interface Problem {
	title: string;
	category: string;
	content: string;
	tests: {
		inputs: string[];
		outputs: string[];
	};
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
			
			// add test cases
			const test_container = document.getElementById('test-cases') as HTMLElement;
			const table = document.createElement('table');
			
			const headerRow = document.createElement('tr');
			const inputHeader = document.createElement('th');
			inputHeader.textContent = 'Input';
			const outputHeader = document.createElement('th');
			outputHeader.textContent = 'Output';
			
			headerRow.appendChild(inputHeader);
			headerRow.appendChild(outputHeader);
			table.appendChild(headerRow);
			
			for (let i = 0; i < problem.tests.inputs.length; i++) {
				const row = document.createElement('tr');

				const inputCell = document.createElement('td');
				inputCell.textContent = problem.tests.inputs[i];

				const outputCell = document.createElement('td');
				outputCell.textContent = problem.tests.outputs[i];

				row.appendChild(inputCell);
				row.appendChild(outputCell);

				table.appendChild(row);
			}
			
			test_container.appendChild(table);
			
		} catch (error) {
			console.error('Error loading data:', error);
		}
	} else {
		console.error('No problemID in the URL path');
	}
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