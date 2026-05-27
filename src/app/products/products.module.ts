import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './page/product-list/product-list.component';
import { ProductFormComponent } from './page/product-form/product-form.component';
import { ProductTableComponent } from './page/product-table/product-table.component';
import { ProductActionMenuComponent } from './components/product-action-menu/product-action-menu.component';
import { DeleteConfirmModalComponent } from './components/delete-confirm-modal/delete-confirm-modal.component';


@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent,
    ProductTableComponent,
    ProductActionMenuComponent,
    DeleteConfirmModalComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
