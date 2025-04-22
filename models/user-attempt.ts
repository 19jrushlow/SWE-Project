import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from "typeorm";
import { User } from "./user"

@Entity()
@Index(["userId", "pageId"], { unique: true })
export class UserAttempt {
	@PrimaryGeneratedColumn()
	public id: number

	@Column()
	public userId: number

	@Column()
	public pageId: string

	@Column()
	public content: string

	@Column()
	public language: string

	@Column()
	public input: string

	@ManyToOne(() => User, (user) => user.userAttempts)
	public user: User
}