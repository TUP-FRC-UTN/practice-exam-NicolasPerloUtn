import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, UntypedFormArray, Validators } from '@angular/forms';
import { Producto } from '../producto';
import { ApiService } from '../api.service';
import { Order } from '../order';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit{

  products: Producto[] = [];
  order: Order[] = [];
  myForm: FormGroup;

  constructor(private fb: FormBuilder, private service: ApiService) {
    this.myForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      productos: this.fb.array([], [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts() {
    const getAllSubscription = this.service.getAll().subscribe({
      next: (productList: Producto[]) => {
        this.products = productList;
      },
      error: (err) => {
        alert('Error al comunicarse con la API')
      }
    })
    const getAllOrders = this.service.getAllOrders().subscribe({
      next: (orderList: Order[]) => {
        this.order = orderList;
      },
      error: (err) => {
        alert('Error al comunicarse con la API')
      }
    })
  }

  get productosFormArray(): FormArray {
    return this.myForm.get('productos') as FormArray;
  }

  onProductChange(index: number) {
    const selectedProductName = this.productosFormArray.at(index).get('name')?.value;
    const selectedProduct = this.products.find(product => product.name === selectedProductName);

    if (selectedProduct) {
      const cantidadControl = this.productosFormArray.at(index).get('cantidad');
      const precioControl = this.productosFormArray.at(index).get('price');
      const stockControl = this.productosFormArray.at(index).get('stock');

      cantidadControl?.setValue(1);
      precioControl?.setValue(selectedProduct.price);
      stockControl?.setValue(selectedProduct.stock);
    }
  }

  onNewEvent() {
    const productoForm = this.fb.group({
      id: [''],  
      name: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      price: [{ value: 0 }],
      stock: [{ value: 0 }]
    });
    this.productosFormArray.push(productoForm);
  }

  onDeleteEvent(index: number) {
    this.productosFormArray.removeAt(index);
  }

  validarCantidadTotalProductos(formArray: FormArray) {
    const total = formArray.controls.reduce((acc, control) => acc + control.get('cantidad')?.value || 0, 0);
    return total > 10 ? { cantidadExcedida: true } : null;
  }

  get cantidadTotalExcedida(): boolean {
    return this.myForm.get('productos')?.errors?.['cantidadExcedida'] ?? false;
  }

  onSubmit() {
    if (this.myForm.valid) {
      console.log(this.myForm.value)
      const productos = this.myForm.get('productos')?.value || [];

      const customerName = this.myForm.get('nombre')?.value || '';
      const email = this.myForm.get('email')?.value || '';
      const timestamp = new Date().toISOString();

      const orderCode = `${customerName.charAt(0).toUpperCase()}${email.slice(-4)}${timestamp}`;
      
      const newOrder: Order = {
        id: '1586', 
        customerName: this.myForm.get('nombre')?.value || '',
        email: this.myForm.get('email')?.value || '',
        products: productos.map((prod: any): Producto => ({
          id: prod.id || '',
          name: prod.name,
          cantidad: prod.cantidad,
          price: prod.price,
          stock: prod.stock
        })),
        total: productos.reduce(
          (sum: number, prod: any) => sum + (prod.price * prod.cantidad), 0),
        orderCode: orderCode,
        timestamp: new Date().toISOString()
      };
  
      this.service.postOrder(newOrder).subscribe(
        (response) => {
          this.order.push(response);
        },
        (error) => {
          console.error('Error al guardar la orden en la API', error);
        }
      );
      console.log('Orden guardada:', newOrder);
      console.log('Todas las órdenes:', this.order);
    } else {
      console.log('Formulario incorrecto');
    }
  }
}
