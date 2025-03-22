import * as fs from "fs";
import { Achievement, AchievementData } from "../models/achievement"

const AppDataSource = require('../models/data-source').default;

export function loadAchievementDirectory(directory: string) {
	try {
        var fileList = fs.readdirSync(directory);
		console.log("Directory opened successfully:", directory);

		// Filter out only json files just incase
		fileList = fileList.filter(file => (file.slice(-5)).toLowerCase() == ".json")
        for(const file of fileList) {
			var path = directory + "/" + file;
			console.log("Path: ", path);
			uploadAchievement(path)
		}
    } catch (error) {
        console.error("Failed to open directory:", directory);
        return false;
    }
}

async function uploadAchievement(path: string) {
	try {
		const jsonData = fs.readFileSync(path, 'utf-8');
		const achievementData = JSON.parse(jsonData)
		const achievementRepository = AppDataSource.getRepository(Achievement);
	
		// Prepare the achievement data from the JSON
		const achievementEntity = new Achievement()
		achievementEntity.id = achievementData.id;

		await achievementRepository.save(achievementEntity);
		console.log("Achievement saved successfully!", achievementEntity);
	} catch (error) {
		// Save failed, give the path to the file
		console.error("Achievement save failed!", path);
	}
}