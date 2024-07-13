/**
 * 主要是客观题库的表。
 */

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Domain } from "./Domain";

@Entity()
export class ChooseProblem {
    @PrimaryGeneratedColumn()
    id: number

    // 题目标题
    @Column()
    title: string

    // 创建者
    @ManyToOne(() => User)
    @JoinColumn()
    creator: User

    // 所属域
    @ManyToOne(() => Domain, { nullable: true })
    @JoinColumn()
    domain: Domain

    // 题目类型
    // 0: 单选题 1: 多选题 2: 判断题 3: 填空题
    @Column()
    type: number

    // 选项，如果是填空题的话，这个是空
    @Column({ nullable: true })
    options: string

    // 答案
    @Column()
    answer: string

    // 创建时间
    @CreateDateColumn({ type: "timestamp" })
    createTime: Date

    // 最后修改时间
    @UpdateDateColumn({ type: "timestamp" })
    lastModifyTime: Date
}