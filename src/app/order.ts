import { Producto } from "./producto";

export interface Order {
    id: string;
    customerName: string;
    email: string;
    products: Producto[];
    total: number;
    orderCode: string;
    timestamp: string;
}
