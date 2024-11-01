import { inject, Injectable } from '@angular/core';
import { Producto } from './producto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './order';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly urlProductos = "http://localhost:3000/products";
  private readonly urlOrders = "http://localhost:3000/orders";

  constructor() { }

  getAll(): Observable<Producto[]> {
    const observable = this.http.get<Producto[]>(this.urlProductos);
    return observable;
  }

  getAllOrders(): Observable<Order[]> {
    const observable = this.http.get<Order[]>(this.urlOrders);
    return observable;
  }
  
  postOrder(order: Order): Observable<Order> {
    const observable = this.http.post<Order>(this.urlOrders, order);
    return observable;
  }
  
}
