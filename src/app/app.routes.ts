import { Routes } from '@angular/router';
import { ListOrdersComponent } from './list-orders/list-orders.component';
import { FormComponent } from './form/form.component';

export const routes: Routes = [
    { path: '', component: ListOrdersComponent },
    { path: 'add-order', component: FormComponent },
    { path: 'list-order', component: ListOrdersComponent },
    { path: '**', redirectTo: '' }
];
