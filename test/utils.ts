import { Achievement, AchievementData } from "../models/achievement"
import { Problem, ProblemData } from "../models/problem"
import { User } from "../models/user"
import { UserProblem } from "../models/user-problem"
import { markUserProblemComplete } from "../services/progresstracker";

const AppDataSource = require('../models/data-source').default;
const bcrypt = require('bcryptjs');

export async function createDummyUser(email: string, password: string, username: string) {
	const userRepository = AppDataSource.getRepository(User);
	const userEntity = new User()
	userEntity.email = email;
	const hashedPassword = await bcrypt.hash(password, 10);
	userEntity.password = hashedPassword;
	userEntity.username = username;

	let user = await userRepository.save(userEntity);
	console.log("Dummy user saved successfully!", userEntity);

	return user.id
	
}

export async function createDummyProblem(problemId: string, difficulty: string, title: string) {
	const problemRepository = AppDataSource.getRepository(Problem);
	const problemEntity = new Problem()
	problemEntity.id = problemId;
	problemEntity.category = "Test";
	problemEntity.difficulty = difficulty;
	problemEntity.title = title;

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

export async function overrideCompletionDates(username: string, targetDate: string) {
	try {
		const userRepository = AppDataSource.getRepository(User);
		const userProblemRepository = AppDataSource.getRepository(UserProblem);

        console.log(`Searching for user with username: ${username}`);
        const userToUpdate = await userRepository.findOne({
            select: {
                id: true,
            },
            where: {
                username: username,
            },
        });

        if (!userToUpdate) {
            console.warn(`User with username '${username}' not found. No records updated.`);
            return
        }

        const userIdToUpdate = userToUpdate.id;
        console.log(`Found user ID: ${userIdToUpdate}. Proceeding with update...`);

        const updateResult = await userProblemRepository.update(
            {
                userId: userIdToUpdate,
            },
            {
                dateReceived: targetDate,
            }
        );

        console.log(`Update executed for user ID ${userIdToUpdate}. Rows affected: ${updateResult.affected}`);
        return

    } catch (error) {
        console.error(`Failed to override completion dates for username '${username}' with date '${targetDate}':`, error);
        throw error;
    }
}

async function createDummyProblemSet() {
	const problems = [
		["test_easy_1", "Easy", "test easy 1"],
		["test_easy_2", "Easy", "test easy 2"],
		["test_easy_3", "Easy", "test easy 3"],
		["test_normal_1", "Normal", "test normal 1"],
		["test_normal_2", "Normal", "test normal 2"],
		["test_normal_3", "Normal", "test normal 3"],
		["test_hard_1", "Hard", "test hard 1"],
		["test_hard_2", "Hard", "test hard 2"],
		["test_hard_3", "Hard", "test hard 3"],
		["test_extreme_1", "Extreme", "test extreme 1"],
		["test_extreme_2", "Extreme", "test extreme 2"],
		["test_extreme_3", "Extreme", "test extreme 3"]
	];

	for (const [id, difficulty, title] of problems) {
		await createDummyProblem(id, difficulty, title);
	}
}

async function markDummyProblems(userId: number, problemIdList: string[]) {
	for (const problemId of problemIdList) {
		await markUserProblemComplete(userId, problemId)
	}
}

async function constructDummyLeader(email: string, password: string, username: string, problems: string[], targetDate: string) {
    let userId = await createDummyUser(email, password, username)
    await markDummyProblems(userId, problems)
    await overrideCompletionDates(username, targetDate)
}

export async function createAncientDummyUsers() {
    const targetDate = "1999-12-31";
    await constructDummyLeader("oldman1@gmail.com", "1234", "old_man_jenkins", ["test_easy_1"], targetDate);
    await constructDummyLeader("oldman2@gmail.com", "1234", "old_man_jenkins_jr", ["test_easy_2"], targetDate);
    await constructDummyLeader("oldman3@gmail.com", "1234", "old_man_paul", ["test_medium_1"], targetDate);
    await constructDummyLeader("oldman4@gmail.com", "1234", "old_man_joe", ["test_hard_1"], targetDate);
    await constructDummyLeader("oldman5@gmail.com", "1234", "old_man_bob", ["test_extreme_1"], targetDate);
}

export async function createExpertDummyUsers() {
    const targetDate = "2025-01-31";
    await constructDummyLeader("expert1@gmail.com", "1234", "expert_bill", ["test_extreme_1"], targetDate);
    await constructDummyLeader("expert2@gmail.com", "1234", "expert_steve", ["test_extreme_2"], targetDate);
    await constructDummyLeader("expert3@gmail.com", "1234", "expert_bob", ["test_extreme_3"], targetDate);
    await constructDummyLeader("expert4@gmail.com", "1234", "expert_ash", ["test_extreme_1", "test_extreme_2"], targetDate);
    await constructDummyLeader("expert5@gmail.com", "1234", "expert_brock", ["test_extreme_1", "test_extreme_2", "test_extreme_3"], targetDate);
}

export async function createNoobDummyUsers() {
    const targetDate = "2025-04-10";
    await constructDummyLeader("noob1@gmail.com", "1234", "noob_master_123", ["test_easy_1"], targetDate);
    await constructDummyLeader("noob2@gmail.com", "1234", "noob_steve", ["test_easy_2"], targetDate);
    await constructDummyLeader("noob3@gmail.com", "1234", "noob_bob", ["test_easy_3"], targetDate);
    await constructDummyLeader("noob4@gmail.com", "1234", "noob_timmy", ["test_easy_1", "test_easy_2"], targetDate);
    await constructDummyLeader("noob5@gmail.com", "1234", "noob_elvis", ["test_easy_1", "test_easy_2", "test_easy_3"], targetDate);
}

export async function seedUsersForLeaderboard() {
	// I'm so sorry for my crimes against awaits/async here 
	await createDummyProblemSet()

	await createAncientDummyUsers()
	await createExpertDummyUsers()
	await createNoobDummyUsers()
}