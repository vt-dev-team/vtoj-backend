import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User";
import { Domain } from "./Domain";

@Entity()
@Index(["title", "domain"])
export class Contest {
    @PrimaryGeneratedColumn()
    id: number

    // 名称
    @Column()
    @Index({ fulltext: true })
    title: string;

    // 比赛描述
    @Column("text")
    description: string;

    // 创建者
    @ManyToOne(() => User)
    @JoinColumn()
    creator: User;

    // 所属域
    @ManyToOne(() => Domain)
    @JoinColumn()
    domain: Domain;

    // 是否公开
    @Column()
    isPublic: boolean;

    // 题目列表，用,隔开
    @Column()
    problemList: string;

    // 比赛模式
    // 0: 正常训练 1: ACM 2: OI 3: IOI
    @Column()
    mode: number;

    // 创建时间
    @CreateDateColumn({ type: "timestamp" })
    createTime: Date;

    // 最后修改时间
    @UpdateDateColumn({ type: "timestamp" })
    lastModifyTime: Date;

    // 开始时间
    @Column({ type: "timestamp" })
    startTime: Date;

    // 结束时间
    @Column({ type: "timestamp" })
    endTime: Date;
}