import { Achievement, AchievementData } from "../models/achievement"
import { Problem, ProblemData } from "../models/problem"
import { User } from "../models/user"

const AppDataSource = require('../models/data-source').default;
const bcrypt = require('bcryptjs');

export async function createDummyUser(email: string, password: string, username: string) {
	const userRepository = AppDataSource.getRepository(User);
	const userEntity = new User()
	userEntity.email = email;
	const hashedPassword = await bcrypt.hash(password, 10);
	userEntity.password = hashedPassword;
	userEntity.username = username;

	await userRepository.save(userEntity);
	console.log("Dummy user saved successfully!", userEntity);
	
}

export async function createDummyProblem(problemName: string, category: string) {
	const problemRepository = AppDataSource.getRepository(Problem);
	const problemEntity = new Problem()
	problemEntity.id = problemName;
	problemEntity.category = category;

	await problemRepository.save(problemEntity);
	console.log("Dummy problem saved successfully!", problemEntity);
}

export async function createDummyAchievement(achievementId: string, requirementType: string, requirementCount: number) {
	const achievementRepository = AppDataSource.getRepository(Achievement);
	const achievementEntity = new Achievement()
	achievementEntity.id = achievementId;
	achievementEntity.requirementType = requirementType;
	achievementEntity.requirementCount = requirementCount;

	await achievementRepository.save(achievementEntity);
	console.log("Dummy achievement saved successfully!", achievementEntity);
}