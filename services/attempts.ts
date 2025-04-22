import { UserAttempt } from "../models/user-attempt"
import { User } from "../models/user"

const AppDataSource = require('../models/data-source').default;

export async function saveAttempt(userId: number, pageId: string, content: string, language: string, input: string) {
	try {
		await AppDataSource
		.getRepository(UserAttempt)
		.createQueryBuilder("user-attempt")
		.insert()
		.into(UserAttempt)
		.values({
			userId: userId,
			pageId: pageId,
			content: content,
			language: language,
			input: input,
		})
		.orUpdate(
			["content", "language", "input"],
			["userId", "pageId"]
		)
		.execute()
	} catch {
		console.log("Attempt saving error! User: " + userId);
	}
}

export async function loadAttempt(userId: number, pageId: string) {
	try {
        const attempt = await AppDataSource
            .getRepository(UserAttempt)
            .createQueryBuilder("user-attempt")
            .select(["user-attempt.content", "user-attempt.language", "user-attempt.input"])
            .where("user-attempt.userId = :userId", { userId })
            .andWhere("user-attempt.pageId = :pageId", { pageId })
            .getOne();

			// if it failed, return blank values
			return attempt ? { content: attempt.content, language: attempt.language, input: attempt.input } : { content: "", language: "", input: "" };
    } catch (error) {
        console.log("Error loading attempt for User: " + userId + " Page: " + pageId);
    }
}