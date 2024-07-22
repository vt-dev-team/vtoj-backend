import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Contest } from "./Contest"
import { Domain } from "./Domain"
import { User } from "./User"
import { Problem } from "./Problem"

/**
 * Language
 * 0    C
 * 1    C++
 * 2    Python
 * 3    Java
 * 4    Pascal
 * 5    JavaScript 
 */

/**
 * Result
 * 0   Pending
 * 1   Pending Rejudge
 * 2   Judging
 * 3   Accepted
 * 4   Wrong Answer
 * 5   Time Limit Exceeded
 * 6   Memory Limit Exceeded
 * 7   Output Limit Exceeded
 * 8   Runtime Error
 * 9   Unknown Error
 * 10  System Error
 * 11  Unaccepted
 */

@Entity()
@Index(["submitter", "problem", "contest", "domain", "result", "language"])
export class Submission {
    @PrimaryGeneratedColumn()
    id: number

    // 提交者
    @ManyToOne(() => User)
    @JoinColumn()
    submitter: User

    // 代码
    @Column("text")
    codeText: string

    // 语言
    @Column()
    language: number

    // 比赛
    @ManyToOne(() => Contest, { nullable: true })
    @JoinColumn()
    contest: Contest

    // 所属域id
    @ManyToOne(() => Domain, { nullable: true })
    @JoinColumn()
    domain: Domain

    // 题目
    @ManyToOne(() => Problem)
    @JoinColumn()
    problem: Problem

    // 结果
    @Column({ default: 0 })
    result: number

    // 得分
    @Column("float", { default: 0 })
    score: number

    // 详细信息
    @Column("text", { default: '[]' })
    info: string

    // 时间消耗
    @Column({ default: 0 })
    timeCost: number

    // 内存消耗
    @Column({ default: 0 })
    memoryCost: number

    // 提交时间
    @CreateDateColumn({ type: "timestamp" })
    submitTime: Date

    // 评测时间
    @UpdateDateColumn({ type: "timestamp" })
    judgeTime: Date

    // 评测机
    @Column({ length: 50, default: 'Local' })
    judgeMachine: string
}