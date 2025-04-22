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

interface ProblemMatch {
	completed: boolean;
	problemId: string;
	title: string;
	category: string;
	difficulty: string;
}


if(window.location.pathname == '/problem') {
	loadProblem();
}
fetchIDE();


// loads everything needed for the problem page based on the problemID
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
			document.getElementById('tags').innerHTML = 'Tags: ' + problem.tags.join(', ');
			problemStatus();
			
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
	const solutionElement = document.getElementById('solution')
	if (solutionElement.style.display == 'block') {
		solutionElement.style.display = 'none';
	}
	else {
		solutionElement.style.display = 'block';
	}
}

async function problemStatus() {
	const urlParams = new URLSearchParams(window.location.search);
	const problemId : string = urlParams.get('problemID');
	
	let userId = await fetchUserId()
	
	let searchString: string = "";
	let statusFilter: string = "complete";
	let categoryFilter: string = "";
	let difficultyFilter: string = "";
	
	try {
		// Allow for timeouts
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);

		const response = await Promise.race([
			fetch('/api/search/findProblems', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					searchString,
					statusFilter,
					categoryFilter,
					difficultyFilter,
					userId
				}),
				signal: controller.signal
			}),
		]);
		
		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error(`Server responded with status ${response.status}`);
		}

		const data = await response.json();
		let complete = false;
		
		for (const problemMatch of data.problemMatches as ProblemMatch[]) {
			if (problemMatch.problemId == problemId) {
				complete = true;
			}
		}
		
		const statusElement = document.getElementById("title") as HTMLHeadingElement;
		
		if (complete) {
			statusElement.innerHTML += " &#10003;";
		} else {
			console.log(userId, complete);
		}
		
	} catch (error) {
		console.log("error getting completion status", error);
	}
}

// embeds the IDE into the page
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

// these scripts are needed for IDE functionality
function loadIDEScripts() {
	const aceScript = document.createElement('script');
	const ideScript = document.createElement('script');
	
	aceScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js';
	aceScript.onload = async () => {
		ideScript.src = 'IDE.js';
		ideScript.onerror = (error) => {
			console.error('Failed to load IDE.js:', error);
		};
		await loadUserAttempt()
	}
	aceScript.onerror = (error) => {
		console.error('Failed to load ace.js:', error);
	};
	
	const ide = document.getElementById('ide');
	ide.appendChild(aceScript);
	ide.appendChild(ideScript);
}

async function fetchUserId() {
	let userId : number = -1;
	const response = await fetch("/api/user/session");
	if (response.ok) {
		const user = await response.json();
		userId = user.id;
	}
	return userId
}

async function loadUserAttempt() {
	let userId = await fetchUserId()
	let userContent = await getUserContent(userId)
}

async function getUserContent(userId: number) {
	// Not logged in
	if (userId == -1) {
		return ""
	}

	createSaveButton()

	console.log("Trying to get user content for: " + userId)

	// Call the API to load the user attempt
	try {
		// Allow for timeouts
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);

		// Get pageID
		let pageId = window.location.pathname;

		const response = await Promise.race([
			fetch('/api/attempts/loadAttempt', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId,
					pageId
				}),
				signal: controller.signal
			}),
		]);

		clearTimeout(timeoutId);

		if (response.ok) {
			const data = await response.json();
			// set language if there was a valid setting
			if (data.attempt.language != "") { 
				setLanguage(data.attempt.language)
				// update the selector too:
				const languageDropdown = document.getElementById("language-dropdown") as HTMLSelectElement;
				const input = document.getElementById('input-text') as HTMLTextAreaElement
				languageDropdown.value = data.attempt.language;
				input.value = data.attempt.input
			}

			let userEditor = ace.edit("editor")
			userEditor.setValue(data.attempt.content)
			userEditor.selection.clearSelection();
		}
	} catch (error) {
		console.error('Error saving attempt:', error);
	}
}

async function saveUserContent() {
	let userId = await fetchUserId()

	// Not logged in
	if (userId == -1) {
		return
	}

	console.log("Trying to save user content for: " + userId)

	// Call the API to save the user attempt
	try {
		// Allow for timeouts
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);

		const languageDropdown = document.getElementById("language-dropdown") as HTMLSelectElement;

		// get the vals
		let userEditor = ace.edit("editor")
		let userContent = userEditor.getValue()
		let pageId = window.location.pathname;
		let language = languageDropdown.value
		let input = (document.getElementById('input-text') as HTMLTextAreaElement).value

		console.log(userContent + " " + language)

		const response = await Promise.race([
			fetch('/api/attempts/saveAttempt', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId,
					pageId,
					userContent,
					language,
					input
				}),
				signal: controller.signal
			}),
		]);

		clearTimeout(timeoutId);
	} catch (error) {
		console.error('Error saving attempt:', error);
	} finally {
		// disable save button maybe? not gonna bother right now
	}
}

async function createSaveButton() {
	const saveButton = document.createElement("button")
	saveButton.id = "save-code"
	saveButton.className = "execution-request"
	saveButton.type = "button"
	saveButton.textContent = "Save Code"
	saveButton.onclick = function() {
		saveUserContent()
	};

	// Add the button to the interaction container
	const interactionContainer = document.querySelector(".interaction-container")
	const firstButton = interactionContainer.firstChild
    interactionContainer.insertBefore(saveButton, firstButton)
}