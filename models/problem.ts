import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany } from "typeorm";
import { UserProblem } from "./user-problem"

export type ProblemData = {
	title: string; 
	category: string;
	content: string;
}

@Entity()
export class Problem {
	@PrimaryColumn()
	id: string

	@Column()
	category: string

	@OneToMany(() => UserProblem, userProblem => userProblem.problemId)
		public userProblems: UserProblem[];
}