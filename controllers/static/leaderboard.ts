interface Leader {
	position: number;
	username: string;
	points: number;
    currentUser: boolean;
}

function clearLeaderboard() {
	let leaderboard: HTMLElement = document.getElementById("leaderboardTable");
	leaderboard.innerHTML = "";
}

async function reloadLeaderboard() {
    clearLeaderboard()

    // Disable reload button while processing
	let reloadButton: HTMLButtonElement = (document.getElementById("reloadButton") as HTMLButtonElement);
	reloadButton.disabled = true;
	reloadButton.textContent = 'Reloading...';

	// Option selectors
	let topFilter: string = (document.getElementById('filterTop') as HTMLSelectElement).value;
	let dateFilter: string = (document.getElementById('filterDate') as HTMLSelectElement).value;

    let userId: number

    // Copying this is a war crime against best practices but oh well
	const response = await fetch("/api/user/session");
    if (response.ok) {
		const user = await response.json();
		userId = user.id;
    } else {
		userId = -1;
	}

	try {
		// Allow for timeouts
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);

		const response = await Promise.race([
			fetch('/api/leaderboard/getLeaders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					topFilter,
					dateFilter,
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
		for (const leader of data.leaders as Leader[]) {
            addLeader(leader)
        }


	} catch (error) {
		console.error('Error loading leaderboard:', error);
	} finally {
		reloadButton.disabled = false;
		reloadButton.textContent = 'Reload';
	}
}

function addLeader(leader: Leader) {
    let leaderboard: HTMLElement = document.getElementById("leaderboardTable");

	// Create the row
	const row = document.createElement("tr");

    // Add color medals based on position
    if (leader.position === 1) {
        row.classList.add("gold-medal");
    } else if (leader.position === 2) {
        row.classList.add("silver-medal");
    } else if (leader.position === 3) {
        row.classList.add("bronze-medal");
    }

	// Populate the elements
	const position = document.createElement("td")
	position.textContent = leader.position.toString()

	const username = document.createElement("td")
	username.textContent = leader.username

    // Add border if its the current user
    if (leader.currentUser === true) {
        row.classList.add("current-user-border");
        username.textContent += " (You)";
    }

	const points = document.createElement("td")
	points.textContent = leader.points.toString()

	row.appendChild(position);
	row.appendChild(username);
	row.appendChild(points);

	leaderboard.appendChild(row);
}

window.onload = () => {
	reloadLeaderboard();
};