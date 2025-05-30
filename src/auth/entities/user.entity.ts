import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends BaseEntity{

    @Column({ unique: true })
    email: string;
    @Column({ select: false })
    password: string;
    @Column('text')
    name: string;
    @Column('text', {
        array: true,
        default: ['admin']
    })
    roles: string[];
    @Column('numeric')
    phoneNumber: number;

}