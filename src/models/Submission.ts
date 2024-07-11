import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from "typeorm"

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
@Index(["submitter", "problem", "result", "language"])
export class Submission {
    @PrimaryGeneratedColumn()
    id: number

    // 提交者
    @Column()
    submitter: number

    // 代码
    @Column("text")
    codeText: string

    // 语言
    @Column()
    language: number

    // 题目
    @Column()
    problem: number

    // 结果
    @Column()
    result: number

    // 得分
    @Column("float")
    score: number

    // 详细信息
    @Column("text")
    info: string

    // 提交时间
    @CreateDateColumn({ type: "timestamp" })
    submitTime: Date

    // 评测时间
    @UpdateDateColumn({ type: "timestamp" })
    judgeTime: Date

    // 评测机
    @Column({ length: 50 })
    judgeMachine: string
}