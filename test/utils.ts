import { Achievement, AchievementData } from "../models/achievement"
import { Problem, ProblemData } from "../models/problem"
import { User } from "../models/user"

const AppDataSource = require('../models/data-source').default;

export function createDummyUser(email: string, password: string) {
	const userRepository = AppDataSource.getRepository(User);
	const userEntity = new User()
	userEntity.email = email;
	userEntity.password = password;

	userRepository.save(userEntity);
	console.log("Dummy user saved successfully!", userEntity);
	
}

export function createDummyProblem(problemName: string, category: string) {
	const problemRepository = AppDataSource.getRepository(Problem);
	const problemEntity = new Problem()
	problemEntity.id = problemName;
	problemEntity.category = category;

	problemRepository.save(problemEntity);
	console.log("Dummy problem saved successfully!", problemEntity);
}

export function createDummyAchievement(achievementId: string, requirementType: string, requirementCount: number) {
	const achievementRepository = AppDataSource.getRepository(Achievement);
	const achievementEntity = new Achievement()
	achievementEntity.id = achievementId;
	achievementEntity.requirementType = requirementType;
	achievementEntity.requirementCount = requirementCount;

	achievementRepository.save(achievementEntity);
	console.log("Dummy achievement saved successfully!", achievementEntity);
}