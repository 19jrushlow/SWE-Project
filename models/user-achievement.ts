import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from "typeorm";
import { User } from "./user"
import { Achievement } from "./achievement"

@Entity()
@Index(["userId", "achievementId"], { unique: true })
export class UserAchievement {
	@PrimaryGeneratedColumn()
	public id: number

	@Column()
	public userId: number

	@Column()
	public achievementId: string

	@CreateDateColumn({ name: 'dateReceived', type: 'timestamp' })
	public dateReceived: Date;

	@ManyToOne(() => User, (user) => user.userAchievements)
	public user: User

	@ManyToOne(() => Achievement, (achievement) => achievement.userAchievements)
	public achievement: Achievement
}