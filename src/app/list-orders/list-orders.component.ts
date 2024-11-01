import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Order } from '../order';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-orders',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './list-orders.component.html',
  styleUrl: './list-orders.component.css'
})
export class ListOrdersComponent implements OnInit{

  ordenes: Order[] = [];

  constructor(private service: ApiService) {}

  ngOnInit(): void {
    this.loadOrdenes();
  }
  
  loadOrdenes() {
    const getAllSubscription = this.service.getAllOrders().subscribe({
      next: (ordersList: Order[]) => {
        this.ordenes = ordersList;
        console.log(this.ordenes)
      },
      error: (err) => {
        alert('Error al comunicarse con la API')
      }
    })
  }

    searchText: string = '';

    get filteredElements() {
      return this.ordenes.filter(order =>
        order.customerName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
}
