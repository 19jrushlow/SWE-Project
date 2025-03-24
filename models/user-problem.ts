import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from "typeorm";
import { User } from "./user"
import { Problem } from "./problem"

@Entity()
@Index(["userId", "problemId"], { unique: true })
export class UserProblem {
	@PrimaryGeneratedColumn()
	public id: number

	@Column()
	public userId: number

	@Column()
	public problemId: string

	@CreateDateColumn({ name: 'dateReceived', type: 'timestamp' })
	public dateReceived: Date;

	@ManyToOne(() => User, (user) => user.userProblems)
	public user: User

	@ManyToOne(() => Problem, (problem) => problem.userProblems)
	public problem: Problem
}