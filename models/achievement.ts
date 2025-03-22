import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { UserAchievement } from "./user-achievement"

export type AchievementData = {
	id: string;
	title: string;
	description: string;
	image: string;
}

@Entity()
export class Achievement {
	@PrimaryColumn()
	id: string

	@OneToMany(() => UserAchievement, userAchievement => userAchievement.achievementId)
	public userAchievements: UserAchievement[];
}