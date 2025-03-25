import { Achievement} from "../models/achievement"
import { UserProblem } from "../models/user-problem"
import { UserAchievement } from "../models/user-achievement"
import { User } from "../models/user"

const AppDataSource = require('../models/data-source').default;

export async function markUserProblemComplete(userId: number, problemId: string) {
	try {

		await AppDataSource
		.getRepository(UserProblem)
		.createQueryBuilder("user-problem")
		.insert()
		.into(UserProblem)
		.values({
			userId: userId,
			problemId: problemId,
		})
		.orIgnore()
		.execute()

		updateAchievementCompletion(userId);
	} catch {
		console.log("Problem completion error! User: " + userId + "Problem: " + problemId);
	}
}

async function updateAchievementCompletion(userId: number) {
	// very rudimentary, this is gonna change
	var totalComplete: number = await getUserTotalProblemCompletion(userId);
	var allAchievements: Achievement[] = await getAllAchievements();
	for (const achievement of allAchievements) {
		console.log("User: " + userId + " Total complete: " + totalComplete);
		if (achievement.requirementType == "total-complete" && totalComplete >= achievement.requirementCount) {
			awardUserAchievement(userId, achievement.id);
		}
	}
	
}

async function getAllAchievements () {
	const achievements = await AppDataSource
    	.getRepository(Achievement)
    	.createQueryBuilder("achievement")
    	.getMany();
	return achievements;
}

async function getUserTotalProblemCompletion(userId: number) {
	const totalComplete = await AppDataSource
    	.getRepository(UserProblem)
    	.createQueryBuilder("user-problem")
    	.where("user-problem.userId = :id", { id: userId })
		.getCount()
	return totalComplete;
}

export async function awardUserAchievement(userId: number, achievementId: string) {
	try {
		await AppDataSource
		.getRepository(UserAchievement)
		.createQueryBuilder("user-achievement")
		.insert()
		.into(UserAchievement)
		.values({
			userId: userId,
			achievementId: achievementId,
		})
		.orIgnore()
		.execute()
	} catch {
		console.log("Achievement awardal error! User: " + userId + "Achievement: " + achievementId);
	}
}