import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserAchievement } from "./user-achievement"

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	email: string

	@Column()
	password: string

	@OneToMany(() => UserAchievement, userAchievement => userAchievement.userId)
	public userAchievements: UserAchievement[];
}