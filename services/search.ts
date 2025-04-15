import { Problem } from "../models/problem"
import { UserProblem } from "../models/user-problem"

const AppDataSource = require('../models/data-source').default;

export interface ProblemWithCompletion {
	completed: boolean;
	problemId: string;
	title: string;
	category: string;
	difficulty: string;
}

export async function findProblems(searchString: string, statusFilter: string, categoryFilter: string, difficultyFilter: string, userId: number) {
	// Find valid problems
	let problems = await getValidProblems(searchString, statusFilter, categoryFilter, difficultyFilter);

	console.log(problems);

	// Deal with completion, do the final filtering
	let finalProblemset: ProblemWithCompletion[] = [];
	for (const problem of problems) {

		// Create a new object
		let newProblem = {
			completed: await checkCompletion(userId, problem.id),
			problemId: problem.id,
			title: problem.title,
			category: problem.category,
			difficulty: problem.difficulty
		}

		if (statusFilter == "complete" && newProblem.completed == false) {
			continue;
		} else if (statusFilter == "incomplete" && newProblem.completed == true) {
			continue;
		}
		finalProblemset.push(newProblem);
	}
	console.log(finalProblemset);
	return finalProblemset;
}

async function getValidProblems (searchString: string, statusFilter: string, categoryFilter: string, difficultyFilter: string) {
	const problemMatches = await AppDataSource
		.getRepository(Problem)
		.createQueryBuilder("problem")
	
	// Partial match for title
	if (searchString && searchString.trim() !== "") {
		problemMatches.andWhere("problem.title ILIKE :title", { title: `%${searchString}%` });
	}

	// Partial match for category
	if (categoryFilter && categoryFilter !== "") {
		problemMatches.andWhere("problem.category ILIKE :category", { category: `%${categoryFilter}%` });
	}

	// Partial match for difficulty
	if (difficultyFilter && difficultyFilter !== "") {
		problemMatches.andWhere("problem.difficulty ILIKE :difficulty", { difficulty: `%${difficultyFilter}%` });
	}

	const problems = await problemMatches.getMany();
	return problems;
}

async function checkCompletion(userId: number, problemId: string) {

	if (userId == -1) {
		return false;
	}

	const match = await AppDataSource
		.getRepository(UserProblem)
    	.createQueryBuilder("userProblem")
    	.where("userProblem.userId = :userId", { userId })
    	.andWhere("userProblem.problemId = :problemId", { problemId })
    	.getOne();

	if (match != null) {
		return true;
	} else {
		return false;
	}
}