import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from "typeorm"

/**
 * 用户表
 * ---
 * 该表存储用户的信息。
 * 
 * 用户基本信息
 * @param id 用户id
 * @param username 用户名
 * @param signature 个性签名
 * @param rating Rating
 * @param tag 标签
 * 用户隐私信息
 * @param realName 真实姓名
 * @param studentId 学号
 * @param email 邮箱
 * @param phone 手机号
 * @param password 密码hash，用bcrypt
 * 用户权限信息
 * @param privilege 权限
 * 用户其他信息
 * @param registerTime 注册时间
 * @param lastLoginTime 最后登录时间
 * 
 * 主键：id
 * 索引：username, email, phone
 */

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Index({ unique: true })
    username: string

    // 密码hash，用bcrypt
    @Column()
    password: string

    // 邮箱
    @Column()
    @Index({ unique: true })
    email: string

    // 手机号
    @Column()
    @Index({ unique: true })
    phone: string

    // 真实姓名
    @Column({ length: 100, default: "" })
    realName: string

    // 学号
    @Column({ length: 100, default: "" })
    studentId: string

    // 权限
    // 这个权限是指默认域的权限，用户在自建域的权限应该要专门开个表
    @Column({ default: 247 })
    privilege: number

    // 个性签名
    @Column({ length: 255, default: "" })
    signature: string

    // Rating
    @Column("float", { default: 1500 })
    rating: number

    @Column({ length: 255, default: "" })
    tag: string

    // 注册时间
    @CreateDateColumn({ type: "timestamp" })
    registerTime: Date

    // 最后登录时间
    @UpdateDateColumn({ type: "timestamp" })
    lastLoginTime: Date
}