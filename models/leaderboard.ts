import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Leaderboard {
	@PrimaryGeneratedColumn()
	id: number

}