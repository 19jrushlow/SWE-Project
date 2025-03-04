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
	cpp: {
		compilerLanguageID: "c++",
		aceLanguageID: "c_cpp",
		compilerID: "g82"
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

async function runCode(): Promise<void> {
	request.source = editor.getValue();
	const outputElement = document.getElementById("output");
	const runCodeButton = document.getElementById("run-code") as HTMLInputElement;
	
	outputElement.textContent = "";
	runCodeButton.disabled = true;
	
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
	
	await new Promise(resolve => setTimeout(resolve, 1500));
	runCodeButton.disabled = false;
}
