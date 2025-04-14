import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany } from "typeorm";
import { UserProblem } from "./user-problem"

export type ProblemData = {
	title: string; 
	category: string;
	difficulty: string;
}

@Entity()
export class Problem {
	@PrimaryColumn()
	id: string

	@Column()
	title: string

	@Column()
	category: string

	@Column()
	difficulty: string

	@OneToMany(() => UserProblem, userProblem => userProblem.problemId)
	public userProblems: UserProblem[];
}