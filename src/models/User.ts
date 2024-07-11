import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from "typeorm"

/**
 * 
# Privilege
1	    访问主站
2	    提交题目
4	    查看题目
8	    查看他人代码
16	    参加比赛
32	    使用博客
64	    发送私信
128	    自由发言
256	    添加题目
512	    举办比赛
1024	获取题目数据
2048	编辑题目
4096	管理比赛
8192	管理发言
16384	管理权限
32768   操作提交记录
65536   下载题目数据
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