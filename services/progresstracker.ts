import { Achievement} from "../models/achievement"
import { UserProblem } from "../models/user-problem"
import { Problem } from "../models/problem"
import { UserAchievement } from "../models/user-achievement"
import { User } from "../models/user"

const AppDataSource = require('../models/data-source').default;

export async function markUserProblemComplete(userId: number, problemId: string) {
	let points = await getProblemPoints(problemId);
	
	try {
		await AppDataSource
		.getRepository(UserProblem)
		.createQueryBuilder("user-problem")
		.insert()
		.into(UserProblem)
		.values({
			userId: userId,
			problemId: problemId,
			points: points,
		})
		.orIgnore()
		.execute()

		updateAchievementCompletion(userId);
	} catch {
		console.log("Problem completion error! User: " + userId + "Problem: " + problemId);
	}
}

async function updateAchievementCompletion(userId: number) {
	let missingAchievements: Achievement[] = await getMissingAchievements(userId);
	for (const achievement of missingAchievements) {
		let requirementScore = await processRequirement(userId, achievement.requirementType)
		console.log("Checking achievement: " + achievement.id + " For user: " + userId + "/n")
		console.log("Requirement type: " + achievement.requirementType + " Score: " + requirementScore + " Needs: " + achievement.requirementCount)
		if (requirementScore >= achievement.requirementCount) {
			awardUserAchievement(userId, achievement.id);
		}
	}
	
}

async function processRequirement(userId: number, requirementType: string) {
	let processedString = requirementType.slice(0, requirementType.indexOf('-'))
	switch(processedString) {
		case "total":
			return await getUserTotalProblemCompletion(userId);
		case "categories":
			return await getTotalCategoriesCompleted(userId);
		default:
			return await getTotalCompletionByCat(userId, processedString);
	}
}

async function getTotalCategoriesCompleted(userId: number) {
	const totalCategories = await AppDataSource
		.getRepository(UserProblem)
		.createQueryBuilder("user-problem")
		.innerJoin("user-problem.problem", "problem")
		.where("user-problem.userId = :userId", { userId })
		.select("COUNT(DISTINCT problem.category)", "count")
		.getRawOne();

	return (totalCategories.count) ?? 0;
}

async function getTotalCompletionByCat(userId: number, categoryFilter: string) {
	const totalCompletionInCategory = await AppDataSource
		.getRepository(UserProblem)
		.createQueryBuilder("user-problem")
		.innerJoin("user-problem.problem", "problem")
		.where("user-problem.userId = :userId", { userId })
		.andWhere("LOWER(problem.category) = :categoryFilter", { categoryFilter })
		.select("COUNT(user-problem.id)", "count")
		.getRawOne();

	return (totalCompletionInCategory.count) ?? 0;
}

async function getAllAchievements () {
	const achievements = await AppDataSource
		.getRepository(Achievement)
		.createQueryBuilder("achievement")
		.getMany();
	return achievements;
}

async function getMissingAchievements(userId: number) {
	const missingAchievements = await AppDataSource
		.getRepository(Achievement)
		.createQueryBuilder("achievement")
		.where((query: any) => {
			const subQuery = query.subQuery()
				.select("userAchievement.achievementId")
				.from(UserAchievement, "userAchievement")
				.where("userAchievement.userId = :userId")
				.getQuery();
			return "achievement.id NOT IN " + subQuery;
		})
		.setParameter("userId", userId)
		.getMany();

	return missingAchievements;
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

async function getProblemPoints(problemId: string) {
	let difficulty = await getDifficulty(problemId)
	switch (difficulty) {
		case "easy":
			return 1
		case "medium":
			return 2
		case "hard":
			return 3
		case "extreme":
			return 4
		case "ludicrous":
			return 5
		default:
			return 1 // pity point
	}
}

async function getDifficulty(problemId: string) {
	try {
		const problem = await AppDataSource
		  .getRepository(Problem)
		  .createQueryBuilder("problem")
		  .select("problem.difficulty")
		  .where("problem.id = :problemId", { problemId })
		  .getOne();
		return problem.difficulty.toLowerCase()
	  } catch (error) {
		console.error("Error fetching difficulty for problemId: " + problemId)
		return "null" 
	  }
}

export async function updateUserAchievements() {
	let users = await AppDataSource
		.getRepository(User)
		.createQueryBuilder("user")
		.getMany()

	console.log("Starting achievement update")
	for (const user of users) {
		await updateAchievementCompletion(user.id)
	}
}