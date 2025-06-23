import { CategoryEntity } from "src/categories/entities/category.entity";
import { ReviewsEntity } from "src/reviews/entities/review.entity";
import { ReviewsController } from "src/reviews/reviews.controller";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity()
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    stock: number;

    @Column('simple-array')
    images: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.products)
    addedBy: UserEntity;

    @ManyToOne(() => CategoryEntity, (cat) => cat.products)
    category: CategoryEntity;

    @OneToMany(() => ReviewsEntity, (rev) => rev.product)
    reviews: ReviewsEntity[];

}
