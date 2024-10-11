import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    image: string; 

    @Column()
    description: string;

    @Column()
    qty: number;

    @Column('decimal')
    price: number;

    @Column({ default: true })
    is_active: boolean;

    @Column({ default: false })
    is_delete: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' })
    updated_at: Date;
}
