import { Expose } from "class-transformer";
import { IsUUID, IsInt, Min } from "class-validator";

export class CreateOrderDto {
  @Expose()
  @IsUUID()
  userId!: string;

  @Expose()
  @IsUUID()
  productId!: string;

  @Expose()
  @IsInt()
  @Min(1)
  quantity!: number;
}
