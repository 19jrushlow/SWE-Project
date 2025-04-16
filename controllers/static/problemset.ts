interface ProblemMatch {
	completed: boolean;
	problemId: string;
	title: string;
	category: string;
	difficulty: string;
}

function clearProblemset() {
	let problemset: HTMLElement = document.getElementById("problemsTable");
	problemset.innerHTML = "";
}

function addProblemRow(problem: ProblemMatch) {
	let problemset: HTMLElement = document.getElementById("problemsTable");

	// Create the row
	const row = document.createElement("tr");

	// Populate the elements
	const completed = document.createElement("td");
	completed.textContent = problem.completed ? "✅" : "";

	const title = document.createElement("td");
	const link = document.createElement("a");
	link.href = `/problem?problemID=${problem.problemId}`;
	link.textContent = problem.title;
	title.appendChild(link);

	const category = document.createElement("td");
	category.textContent = problem.category;

	const difficulty = document.createElement("td");
	difficulty.textContent = problem.difficulty;

	row.appendChild(completed);
	row.appendChild(title);
	row.appendChild(category);
	row.appendChild(difficulty);

	problemset.appendChild(row);

}

async function applyFilters() {
	clearProblemset()
	
	// Disable search button while processing
	let searchButton: HTMLButtonElement = (document.getElementById("searchButton") as HTMLButtonElement);
	searchButton.disabled = true;
	searchButton.textContent = 'Searching...';

	// Input search string
	let searchString: string = (document.getElementById('searchInput') as HTMLInputElement).value;

	// Option selectors
	let statusFilter: string = (document.getElementById('filterStatus') as HTMLSelectElement).value;
	let categoryFilter: string = (document.getElementById('filterCategory') as HTMLSelectElement).value;
	let difficultyFilter: string = (document.getElementById('filterDifficulty') as HTMLSelectElement).value;

	let userId: number = await getUserId();
	// Call the API for a query to be made using these filters
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

		// Fill the table with data
		for (const problemMatch of data.problemMatches as ProblemMatch[]) {
			addProblemRow(problemMatch);
		}
	} catch (error) {
		console.error('Error applying filters:', error);
	} finally {
		searchButton.disabled = false;
		searchButton.textContent = 'Search';
	}
}

async function getUserId() {
	const response = await fetch("/api/user/session");
    if (response.ok) {
		const user = await response.json();
		return user.id;
    } else {
		return -1;
	}
}

async function loadCategories() {
	const response = await fetch("/api/search/getCategories");
    if (response.ok) {
		const categories = await response.json();
		console.log(categories.data);
		for (let category of categories.data) {
			if (category.toLowerCase() == "test") { continue; }
			addOption("filterCategory", category as string)
		}
    } else {
		console.error("Error loading categories!")
	}
}

async function loadDifficulties() {
	const response = await fetch("/api/search/getDifficulties");
    if (response.ok) {
		const difficulties = await response.json();
		console.log(difficulties.data);
		for (let difficulty of difficulties.data) {
			addOption("filterDifficulty", difficulty as string)
		}
    } else {
		console.error("Error loading difficulties!")
	}
}

function addOption(target: string, content: string) {
	const targetOption = document.getElementById(target) as HTMLSelectElement;

	const option = document.createElement("option");
	option.value = content;
	option.textContent = content;
	
	targetOption.appendChild(option);
}

async function loadOptions() {
	loadCategories();
	loadDifficulties();
}

window.onload = () => {
	loadOptions();
	applyFilters();
  };
  