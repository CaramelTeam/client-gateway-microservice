import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";
import { OrderSatusList, OrderStatus } from "../enum/order.enum";


export class CreateOrderDto {
    @IsNumber()
    @IsPositive()
    totalAmount: number;
    @IsNumber()
    @IsPositive()
    totalItems: number;
    @IsEnum(OrderSatusList, {
        message: `Possible values are ${OrderSatusList.join(', ')}`
    })
    @IsOptional()
    status: OrderStatus = OrderStatus.PENDING;
    @IsBoolean()
    @IsOptional()
    paid: boolean = false;
}
