import { CategoryEntity } from "src/categories/entities/category.entity";
import { Roles } from "src/utils/common/user-roles.enum";
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Index()
    @Column({unique:true})
    email: string;

    @Column({select:false})
    password: string;

    @Column({type: 'enum', enum:Roles,default:Roles.USER})
    role:Roles

    @CreateDateColumn()
    createdDate:Date

    @UpdateDateColumn()
    updatedDate:Date

    @OneToMany(() => CategoryEntity,(category) => category.addedBy)
    categories:CategoryEntity[];
    
    
}
