import * as fs from "fs";
import { Achievement, AchievementData } from "../models/achievement"
import { Problem, ProblemData } from "../models/problem"

const AppDataSource = require('../models/data-source').default;

export function loadAllAchievements(directory: string) {
	var jsonPaths = fetchJsonsFromDir(directory)
	if (jsonPaths != -1) {
		jsonPaths = jsonPaths as string[];
		for (const filePath of jsonPaths) {
			uploadAchievements(filePath);
		}
	} else {
		console.error("Achievement JSON fetch failed");
		return -1;
	}
}

async function uploadAchievements(path: string) {
	try {
		const jsonData = fs.readFileSync(path, 'utf-8');
		const achievementData = JSON.parse(jsonData)
		const achievementRepository = AppDataSource.getRepository(Achievement);
	
		// Prepare the achievement data from the JSON
		const achievementEntity = new Achievement()
		achievementEntity.id = achievementData.id;
		achievementEntity.requirementType = achievementData.requirementType;
		achievementEntity.requirementCount = achievementData.requirementCount;

		await achievementRepository.save(achievementEntity);
		console.log("Achievement saved successfully!", achievementEntity);
	} catch (error) {
		// Save failed, give the path to the file
		console.error("Achievement save failed!", path);
	}
}

export function loadAllProblems(directory: string) {
	var jsonPaths = fetchJsonsFromDir(directory)
	if (jsonPaths != -1) {
		jsonPaths = jsonPaths as string[];
		for (const filePath of jsonPaths) {
			uploadProblems(filePath);
		}
		return 0;
	} else {
		console.error("Problem JSON fetch failed");
		return -1;
	}
}

async function uploadProblems(path: string) {
	try {
		const jsonData = fs.readFileSync(path, 'utf-8');
		const problemData = JSON.parse(jsonData)
		
		const problemRepository = AppDataSource.getRepository(Problem);

		// Loop over each problem object in each file
		for (var [problemName, problem] of Object.entries(problemData)) {
			// Cast for type safety
			const castProblem = problem as ProblemData;

			// Prepare the problem data from the JSON
			const problemEntity = new Problem()
			problemEntity.id = problemName;
			problemEntity.title = castProblem.title;
			problemEntity.category = castProblem.category;
			problemEntity.difficulty = castProblem.difficulty;

			await problemRepository.save(problemEntity);
			console.log("Problem saved successfully!", problemEntity);
		
		}	
	} catch (error) {
		// Save failed, give the path to the file
		console.error("Problem save failed!", path);
	}
}

function fetchJsonsFromDir(directory: string) {
	try {                 
		var fileList = fs.readdirSync(directory);
		console.log("Directory opened successfully:", directory);

		var jsonPaths: string[] = [];

		// Filter out only json files
		fileList = fileList.filter(file => (file.slice(-5)).toLowerCase() == ".json")
		for(const file of fileList) {
			var path = directory + "/" + file;
			console.log("Path: ", path);
			jsonPaths.push(path);
		}
		// Return -1 if the directory was empty, otherwise gives all the file paths.
		return jsonPaths.length > 0 ? jsonPaths : -1;
	} catch (error) {
		console.error("Failed to open directory:", directory);
		return -1;
	}
}