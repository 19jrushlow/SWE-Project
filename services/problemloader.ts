import * as fs from "fs";
import { Problem, ProblemData } from "../models/problem"

const AppDataSource = require('../models/data-source').default;

export function loadProblemDirectory(directory: string) {
	try {                 
        var fileList = fs.readdirSync(directory);
		console.log("Directory opened successfully:", directory);

		// Filter out only json files just incase
		fileList = fileList.filter(file => (file.slice(-5)).toLowerCase() == ".json")
        for(const file of fileList) {
			var path = directory + "/" + file;
			console.log("Path: ", path);
			uploadProblem(path)
		}
    } catch (error) {
        console.error("Failed to open directory:", directory);
        return false;
    }
}

async function uploadProblem(path: string) {
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
			problemEntity.category = castProblem.category;

			await problemRepository.save(problemEntity);
			console.log("Problem saved successfully!", problemEntity);
		
		}	
	} catch (error) {
		// Save failed, give the path to the file
		console.error("Problem save failed!", path);
	}

	
	
}
