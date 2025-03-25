import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { UserAchievement } from "./user-achievement"

export type AchievementData = {
	id: string;
	title: string;
	description: string;
	image: string;
	requirementType: string;
	requirementCount: number;
}

@Entity()
export class Achievement {
	@PrimaryColumn()
	id: string

	@Column()
	requirementType: string
	
	@Column()
	requirementCount: number

	@OneToMany(() => UserAchievement, userAchievement => userAchievement.achievementId)
	public userAchievements: UserAchievement[];
}