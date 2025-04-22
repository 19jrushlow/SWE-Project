import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserAchievement } from "./user-achievement"
import { UserProblem } from "./user-problem"
import { UserAttempt } from "./user-attempt"

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	email: string

	@Column({nullable: true})
	username?: string

	@Column()
	password: string

	@OneToMany(() => UserAchievement, userAchievement => userAchievement.userId)
	public userAchievements: UserAchievement[];

	@OneToMany(() => UserProblem, userProblem => userProblem.userId)
	public userProblems: UserProblem[];

	@OneToMany(() => UserAttempt, userAttempt => userAttempt.userId)
	public userAttempts: UserAttempt[];
}