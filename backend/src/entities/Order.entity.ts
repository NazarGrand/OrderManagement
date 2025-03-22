import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from "typeorm";
import { User } from "./User.entity";
import { Product } from "./Product.entity";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column({ type: "integer" })
  quantity!: number;

  @Column({ type: "decimal", default: 0 })
  totalPrice!: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @BeforeInsert()
  calculateTotalPrice() {
    if (this.product && this.quantity) {
      this.totalPrice = this.product.price * this.quantity;
    }
  }

  @AfterInsert()
  async afterInsert() {
    console.log(`Inserted order with id: ${this.id}, user: ${this.user.id}`);
  }

  @AfterRemove()
  async afterRemove() {
    console.log(`Removed order with id: ${this.id}, user: ${this.user.id}`);
  }

  @AfterUpdate()
  async afterUpdate() {
    console.log(`Updated order with id: ${this.id}, user: ${this.user.id}`);
  }
}
