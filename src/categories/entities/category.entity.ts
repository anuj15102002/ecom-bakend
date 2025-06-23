import { ProductEntity } from "src/products/entities/product.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @OneToMany(() => ProductEntity, (pro) => pro.category)
    products: ProductEntity[];

}
