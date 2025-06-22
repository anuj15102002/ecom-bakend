import { UserEntity } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('categories')
export class CategoryEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Index()
    @Column({unique: true})
    title:string;

    @Column()
    description:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @ManyToOne(() => UserEntity,(user) => user.categories,{ cascade: true })
    addedBy:UserEntity;

}
