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

export async function createAncientDummyUsers() {
    const targetDate = "1999-12-31";
    let userId;

    userId = await createDummyUser("oldman1@gmail.com", "1234", "old_man_jenkins");
    await markDummyProblems(userId, ["test_easy_1"]);
    await overrideCompletionDates("old_man_jenkins", targetDate);

    userId = await createDummyUser("oldman2@gmail.com", "1234", "old_man_jenkins_jr");
    await markDummyProblems(userId, ["test_easy_2"]);
    await overrideCompletionDates("old_man_jenkins_jr", targetDate);

    userId = await createDummyUser("oldman3@gmail.com", "1234", "old_man_paul");
    await markDummyProblems(userId, ["test_medium_1"]);
    await overrideCompletionDates("old_man_paul", targetDate);

    userId = await createDummyUser("oldman4@gmail.com", "1234", "old_man_joe");
    await markDummyProblems(userId, ["test_hard_1"]);
    await overrideCompletionDates("old_man_joe", targetDate);

    userId = await createDummyUser("oldman5@gmail.com", "1234", "old_man_bob");
    await markDummyProblems(userId, ["test_extreme_1"]);
    await overrideCompletionDates("old_man_bob", targetDate);
}

export async function createExpertDummyUsers() {
    const targetDate = "2025-01-31";
    let userId;

    userId = await createDummyUser("expert1@gmail.com", "1234", "expert_bill");
    await markDummyProblems(userId, ["test_extreme_1"]);
    await overrideCompletionDates("expert_bill", targetDate);

    userId = await createDummyUser("expert2@gmail.com", "1234", "expert_steve");
    await markDummyProblems(userId, ["test_extreme_2"]);
    await overrideCompletionDates("expert_steve", targetDate);

    userId = await createDummyUser("expert3@gmail.com", "1234", "expert_bob");
    await markDummyProblems(userId, ["test_extreme_3"]);
    await overrideCompletionDates("expert_bob", targetDate);

    userId = await createDummyUser("expert4@gmail.com", "1234", "expert_ash");
    await markDummyProblems(userId, ["test_extreme_1", "test_extreme_2"]);
    await overrideCompletionDates("expert_ash", targetDate);

    userId = await createDummyUser("expert5@gmail.com", "1234", "expert_brock");
    await markDummyProblems(userId, ["test_extreme_1", "test_extreme_2", "test_extreme_3"]);
    await overrideCompletionDates("expert_brock", targetDate);
}

export async function createNoobDummyUsers() {
    const targetDate = "2025-04-10";
    let userId;

    userId = await createDummyUser("noob1@gmail.com", "1234", "noob_master_123");
    await markDummyProblems(userId, ["test_easy_1"]);
    await overrideCompletionDates("noob_master_123", targetDate);

    userId = await createDummyUser("noob2@gmail.com", "1234", "noob_steve");
    await markDummyProblems(userId, ["test_easy_2"]);
    await overrideCompletionDates("noob_steve", targetDate);

    userId = await createDummyUser("noob3@gmail.com", "1234", "noob_bob");
    await markDummyProblems(userId, ["test_easy_3"]);
    await overrideCompletionDates("noob_bob", targetDate);

    userId = await createDummyUser("noob4@gmail.com", "1234", "noob_timmy");
    await markDummyProblems(userId, ["test_easy_1", "test_easy_2"]);
    await overrideCompletionDates("noob_timmy", targetDate);

    userId = await createDummyUser("noob5@gmail.com", "1234", "noob_elvis");
    await markDummyProblems(userId, ["test_easy_1", "test_easy_2", "test_easy_3"]);
    await overrideCompletionDates("noob_elvis", targetDate);
}

export async function seedUsersForLeaderboard() {
	// I'm so sorry for my crimes against awaits/async here 
	await createDummyProblemSet()

	await createAncientDummyUsers()
	await createExpertDummyUsers()
	await createNoobDummyUsers()
}