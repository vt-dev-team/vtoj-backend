import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User";
import { Domain } from "./Domain"

@Entity()
@Index(["creator", "domain"])
export class Announcement {
    @PrimaryGeneratedColumn()
    id: number

    // 标题
    @Column()
    @Index({ fulltext: true })
    title: string;

    // 内容
    @Column("text")
    content: string;

    // 创建者
    @ManyToOne(() => User)
    @JoinColumn()
    creator: User;

    // 所属的域id
    @ManyToOne(() => Domain)
    @JoinColumn()
    domain: Domain;

    // 创建时间
    @CreateDateColumn({ type: "timestamp" })
    createTime: Date;

    // 最后修改时间
    @UpdateDateColumn({ type: "timestamp" })
    lastModifyTime: Date;
}