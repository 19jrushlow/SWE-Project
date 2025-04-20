interface CompilerOptions {
	executorRequest: boolean;
}

interface Filters {
	execute: boolean;
}

interface ExecuteParameters {
	stdin: string;
}

interface CompilerRequest {
	compiler: string;
	options: {
		compilerOptions: CompilerOptions;
		filters: Filters;
		executeParameters?: ExecuteParameters;
	};
	lang: string;
	allowStoreCodeDebug: boolean;
	source?: string;
}

interface languageBinding {
	compilerLanguageID: string;
	aceLanguageID: string;
	compilerID: string;
}


const bindings: { [key: string]: languageBinding } = {
	python: {
		compilerLanguageID: "python",
		aceLanguageID: "python",
		compilerID: "python313"
	},
	"c++": {
		compilerLanguageID: "c++",
		aceLanguageID: "c_cpp",
		compilerID: "g82"
	},
	rust: {
		compilerLanguageID: "rust",
		aceLanguageID: "rust",
		compilerID: "r1850"
	},
	javaScript: {
		compilerLanguageID: "javascript",
		aceLanguageID: "javascript",
		compilerID: "v8113"
	},
	"c#": {
		compilerLanguageID: "csharp",
		aceLanguageID: "csharp",
		compilerID: "dotnettrunkcsharp"
	}
};

let executionURL = "";
let request: CompilerRequest = {
	compiler: "",
	options: {
		compilerOptions: {
			executorRequest: true
		},
		filters: {
			execute: true
		},
	},
	lang: "",
	allowStoreCodeDebug: true
}


// default IDE settings
const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
setLanguage("python")

populateLanguageDropdown();
document.getElementById("language-dropdown")?.addEventListener("change", (event) => {
	const selectedLanguage = (event.target as HTMLSelectElement).value;
	setLanguage(selectedLanguage);
});


function setLanguage(languageKey: string): void {
	const binding = bindings[languageKey];
	if (!binding) {return;}
	
	const compilerLanguageID = binding.compilerLanguageID;
	const aceLanguageID = binding.aceLanguageID;
	const compilerID = binding.compilerID;
	
	request.lang = compilerLanguageID;
	request.compiler = compilerID;

	editor.session.setMode(`ace/mode/${aceLanguageID}`);
	executionURL = `https://godbolt.org/api/compiler/${compilerID}/compile`;
}

function populateLanguageDropdown() {
	const dropdown = document.getElementById("language-dropdown") as HTMLSelectElement;
	
	for (const key in bindings) {
		if (bindings.hasOwnProperty(key)) {
			const option = document.createElement("option");
			option.value = key;
			option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
			dropdown.appendChild(option);
		}
	}
}

// input is the input fed to the user's program, target is where to display the result, trimCredits should only be used for test cases to clean the API response
async function runCode(input: string, target: HTMLElement, trimCredits: boolean): Promise<void> {
	request.source = editor.getValue();
	request.options.executeParameters = {stdin: input};
	
	target.textContent = "";
	
	return fetch(executionURL, 
	{
		method: "POST",
		body: JSON.stringify(request),
		headers: {"Content-type": "application/json"},
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('idk2');
		}
		return response.text();
	})
	.then(data => {
		if (target) {
			if (trimCredits) {
				data = data.split('\n').slice(3).join('\n');
			}
			target.textContent = data;
		}
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

// sends user code to compiler explorer API
async function runUserCode() {
	const executionButtons = document.getElementsByClassName('execution-request');
	for (var i = 0; i < executionButtons.length; i++) {
		(executionButtons[i] as HTMLButtonElement).disabled = true;
	}
	
	await runCode((document.getElementById('input-text') as HTMLTextAreaElement).value, document.getElementById('output'), false);
	await new Promise(resolve => setTimeout(resolve, 1500));
	for (var i = 0; i < executionButtons.length; i++) {
		(executionButtons[i] as HTMLButtonElement).disabled = false;
	}
}

// sends user code to compiler explorer API for each test case
async function runTests() {
	const executionButtons = document.getElementsByClassName('execution-request');
	for (var i = 0; i < executionButtons.length; i++) {
		(executionButtons[i] as HTMLButtonElement).disabled = true;
	}
	
	const testTable = document.getElementById('test-case-table') as HTMLTableElement;
	var promises = [];
	for (let i = 1, row; row = testTable.rows[i]; i++) {
		row.style.backgroundColor = 'transparent';
		const input = row.cells[0].textContent;
		const target = row.cells[2];
		promises.push(runCode(input, target, true));
	}
	
	await Promise.allSettled(promises);
	await new Promise(resolve => setTimeout(resolve, 1500));
	for (let i = 0; i < executionButtons.length; i++) {
		(executionButtons[i] as HTMLButtonElement).disabled = false;
	}

	await checkTests();
}

async function checkTests() {
	const testTable = document.getElementById('test-case-table') as HTMLTableElement;

	// check for completion
	let anyWrong: boolean = false;
	for (let i = 1, row; row = testTable.rows[i]; i++) {
		// Doing this because its easy right now, but want to note here that it's possible to cheese completion via inspecting element and changing the expected output.
		// Solution would be to pull the expected output from the JSON, will change this later if I have time
		const expectedOutput = row.cells[1].textContent;
		const userOutput = row.cells[2].textContent;
		if (userOutput.trim() != expectedOutput.trim()) {
			console.log("Incorrect! Expected: " + expectedOutput + " User: " + userOutput);
			anyWrong = true;
			row.style.backgroundColor = 'red';
		}
		else {
			row.style.backgroundColor = 'lime';
		}
	}

	// none were wrong, call API to mark the problem as complete for the user
	if (!anyWrong) {
		(document.getElementById("title") as HTMLHeadingElement).innerHTML += " &#10003;";
		
		const response = await fetch("/api/user/session");

    	if (response.ok) {
			const user = await response.json();
			const urlParams = new URLSearchParams(window.location.search);
			const problemId = urlParams.get('problemID');
			const userId: number = user.id
		
			await fetch('/api/progresstracker/markProblem', {
				method: 'POST',
				headers: {
			  	'Content-Type': 'application/json',
				},
				body: JSON.stringify({
			  	userId,
			  	problemId,
				}),
		  	});

      	} else {
			console.log("Guest completed a problem successfully");
	  	}
	}
}