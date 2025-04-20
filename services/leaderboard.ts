import { UserProblem } from "../models/user-problem"
import { User } from "../models/user"

const AppDataSource = require('../models/data-source').default;

export interface LeaderWithFlags {
	position: number;
	username: string;
	points: number;
    currentUser: boolean;
}

export async function getLeaders(topFilter: string, dateFilter: string, userId: number) {
    let max = getTopNum(topFilter)
    let date = convertDateFilter(dateFilter)

    console.log("Top: " + max + "Date: " + date)
    
    let users = await getAllUsers()

    // Get all users and sum their scores.
    let userPointsPairs: LeaderWithFlags[] = []
    for (let user of users) {
        let score = await getScore(user.id, date)
        console.log("Username: " + user.username + " Score: " + score)
        let userPointsPair = {
			position: 0,
            username: user.username,
            points: score,
            currentUser: false
		}

        // Mark the current user so it can be highlighted
        if (userId == user.id) { userPointsPair.currentUser = true }

        userPointsPairs.push(userPointsPair)
    }

    // Sort by points descending.
    userPointsPairs.sort((a, b) => { return b.points - a.points })

    // Assign the positions.
    calculatePositions(userPointsPairs)

    // Filter the top X individuals
    if (max != -1) {
        userPointsPairs = userPointsPairs.slice(0, max)
    }

    // Log it and send it back
    console.log(userPointsPairs);
    return userPointsPairs;
}

async function getAllUsers() {
    const users = await AppDataSource
            .getRepository(User)
            .createQueryBuilder("user")
            .getMany();
    return users;
}

async function getScore(userId: number, date: string) {
    let queryBuilder = await AppDataSource
        .createQueryBuilder(UserProblem, "userProblem") // Target UserProblem entity
        .select("SUM(userProblem.points)", "totalScore") // Select SUM
        .where("userProblem.userId = :userId", { userId: userId }); // Filter by User

    if (date !== "all") {
        queryBuilder = queryBuilder.andWhere("userProblem.dateReceived > :dateFilter", { dateFilter: date });
    }

    const result = await queryBuilder.getRawOne();

    // Return the total, otherwise return 0 if there were no entries.
    const totalScore = result.totalScore ? parseInt(result.totalScore, 10) : 0;
    return totalScore
}

function calculatePositions(userPointsPairs: LeaderWithFlags[]) {
    if (userPointsPairs.length > 0) {
        userPointsPairs[0].position = 1;
    
        for (let i = 1; i < userPointsPairs.length; i++) {
            const currentItem = userPointsPairs[i];
            const previousItem = userPointsPairs[i - 1];
    
            if (currentItem.points === previousItem.points) {
                currentItem.position = previousItem.position;
            } else {
                currentItem.position = i + 1;
            }
        }
    }
}

function getTopNum(topFilter: string) {
    switch(topFilter) {
        case "":
            return -1
        default:
            return parseInt(topFilter)
    }
}

function convertDateFilter(dateFilter: string) {
    const currentDate = new Date();
    
    switch(dateFilter) {
        case "":
            return "all"
        case "Week":
            currentDate.setDate(currentDate.getDate() - 7)
            break
        case "Month":
            currentDate.setMonth(currentDate.getMonth() - 1)
            break
        case "Year":
            currentDate.setFullYear(currentDate.getFullYear() - 1)
            break
    }

    // Year, month, day
    return currentDate.toISOString().split('T')[0]
}