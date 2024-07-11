import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User";
import { Domain } from "./Domain"

@Entity()
@Index(["pid", "creator", "difficulty", "domain", "judgeMethod"])
export class Problem {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Index({ fulltext: true })
    pid: string

    // 标题
    @Column()
    @Index({ fulltext: true })
    title: string;

    // 题目描述
    @Column("text")
    description: string;

    // 创建者
    @ManyToOne(() => User)
    @JoinColumn()
    creator: User;

    // 难度
    @Column()
    difficulty: number;

    // 以逗号分隔的标签
    @Column()
    @Index({ fulltext: true })
    tags: string;

    // 所属的域id
    @ManyToOne(() => Domain)
    @JoinColumn()
    domain: Domain;

    // 时间限制
    @Column()
    timeLimit: number;

    // 内存限制
    @Column()
    memoryLimit: number;

    // 评测方式
    // 0: Normal Judge, 1: Special Judge, 2: Submit Answer, 3: Interactive Judge
    @Column()
    judgeMethod: number;

    // 创建时间
    @CreateDateColumn({ type: "timestamp" })
    createTime: Date;

    // 最后修改时间
    @UpdateDateColumn({ type: "timestamp" })
    lastModifyTime: Date;
}