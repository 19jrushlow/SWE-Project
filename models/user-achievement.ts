import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./user"
import { Achievement } from "./achievement"

@Entity()
export class UserAchievement {
	@PrimaryGeneratedColumn()
	public id: number

	@Column()
	public userId: string

	@Column()
	public achievementId: string

	@CreateDateColumn({ name: 'dateReceived', type: 'timestamp' })
	public dateReceived: Date;

	@ManyToOne(() => User, (user) => user.userAchievements)
	public user: User

	@ManyToOne(() => Achievement, (achievement) => achievement.userAchievements)
	public achievement: Achievement
}