import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-action-menu',
  templateUrl: './product-action-menu.component.html',
  styleUrls: ['./product-action-menu.component.scss'],
})
export class ProductActionMenuComponent {
  open = false;

  @Output() edit = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  toggleMenu(): void {
    this.open = !this.open;
  }

  editProduct(): void {
    this.open = false;
    this.edit.emit();
  }

  deleteProduct(): void {
    this.open = false;
    this.remove.emit();
  }
}