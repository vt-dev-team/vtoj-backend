// src/models/TrainPlan.ts

// 训练计划的实体类

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, JoinTable, ManyToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Problem } from "./Problem";
import { ChooseProblem } from "./ChooseProblem";
import { Domain } from "./Domain";

@Entity()
export class TrainPlan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    // 创建者
    @ManyToOne(() => User)
    @JoinColumn()
    creator: User;

    // 所属域
    @ManyToOne(() => Domain, { nullable: true })
    @JoinColumn()
    domain: Domain;

    // 题目
    @ManyToMany(() => Problem)
    @JoinTable()
    problems: Problem[];

    @ManyToMany(() => ChooseProblem)
    @JoinTable()
    chooseProblems: ChooseProblem[];

    // 创建时间
    @CreateDateColumn({ type: "timestamp" })
    createTime: Date;

    // 最后修改时间
    @UpdateDateColumn({ type: "timestamp" })
    lastModifyTime: Date;
}