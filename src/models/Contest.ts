import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm"
import { User } from "./User";
import { Domain } from "./Domain";
import { Problem } from "./Problem";
import { ChooseProblem } from "./ChooseProblem";

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
    @ManyToOne(() => Domain, { nullable: true })
    @JoinColumn()
    domain: Domain;

    // 是否公开
    @Column()
    isPublic: boolean;

    // 比赛密码
    @Column()
    password: string;

    // 比赛模式
    // 0: 正常训练 1: ACM 2: OI 3: IOI
    @Column()
    mode: number;

    // 题目列表
    @ManyToMany(() => Problem)
    @JoinTable()
    problems: Problem[];

    // 客观题列表
    @ManyToMany(() => ChooseProblem)
    @JoinTable()
    chooseProblems: ChooseProblem[];

    // 额外管理人员
    @ManyToMany(() => User)
    @JoinTable()
    managers: User[];

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

    // 封榜时间
    @Column({ type: "timestamp" })
    freezeTime: Date;
}