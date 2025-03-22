import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";

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

}