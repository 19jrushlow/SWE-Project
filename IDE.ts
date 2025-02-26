interface CompilerOptions {
	executorRequest: boolean;
}

interface Filters {
	execute: boolean;
}

interface CompilerRequest {
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

const executionURL = "https://godbolt.org/api/compiler/python313/compile";

const request: CompilerRequest = {
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
	request.source = editor.getValue();
	const outputElement = document.getElementById("output");
	outputElement.textContent = "";

	fetch(executionURL, 
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
		if (outputElement) {
			outputElement.textContent = data;
		}
	})
	.catch(error => {
		console.error('Error:', error);
	});
}
