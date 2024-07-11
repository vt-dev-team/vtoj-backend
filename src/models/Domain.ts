import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User";

@Entity()
export class Domain {
    @PrimaryGeneratedColumn()
    id: number

    // 名称
    @Column()
    @Index({ fulltext: true })
    name: string;

    // 域描述
    @Column("text")
    description: string;

    // 创建者
    @ManyToOne(() => User)
    @JoinColumn()
    creator: User;

    // 默认权限，即未登录用户或未加入域的权限
    @Column()
    defaultPermission: number;

    // 创建时间
    @CreateDateColumn({ type: "timestamp" })
    createTime: Date;

    // 最后修改时间
    @UpdateDateColumn({ type: "timestamp" })
    lastModifyTime: Date;
}