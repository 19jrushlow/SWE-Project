interface CompilerOptions {
	executorRequest: boolean;
}

interface Filters {
	execute: boolean;
}

interface TestRequest {
	compiler: string;
	options: {
		compilerOptions: CompilerOptions;
		filters: Filters;
		tools: any[];
	};
	lang: string;
	allowStoreCodeDebug: boolean;
	source?: string;
}


const editor = ace.edit("editor");
editor.session.setMode("ace/mode/python");
editor.setTheme("ace/theme/monokai")

const pythonExecutionURL = "https://godbolt.org/api/compiler/python313/compile";

const testRequest: TestRequest = {
	compiler: "python313",
	options: {
		compilerOptions: {
			executorRequest: true
		},
		filters: {
			execute: true
		},
		tools: [],
	},
	lang: "python",
	allowStoreCodeDebug: true
}

function runCode(): void {
	testRequest.source = editor.getValue();
	const outputElement = document.getElementById("output");
	outputElement.textContent = "";

	fetch(pythonExecutionURL, 
	{
		method: "POST",
		body: JSON.stringify(testRequest),
		headers: {"Content-type": "application/json"},
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('idk2');
		}
		return response.text();
	})
	.then(data => {
		if (outputElement) {
			outputElement.textContent = data;
		}
	})
	.catch(error => {
		console.error('Error:', error);
	});
}
