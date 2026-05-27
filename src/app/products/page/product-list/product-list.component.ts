import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FinancialProduct } from '../../models/financial-product.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: FinancialProduct[] = [];

  searchTerm = '';
  pageSize = 5;
  currentPage = 1;

  loading = false;
  deleting = false;
  errorMessage = '';

  selectedProduct: FinancialProduct | null = null;

  pageSizeOptions = [5, 10, 20];

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  get filteredProducts(): FinancialProduct[] {
    const text = this.searchTerm.trim().toLowerCase();

    if (!text) {
      return this.products;
    }

    return this.products.filter((product) => {
      const rowText = [
        product.id,
        product.name,
        product.description,
        product.date_release,
        product.date_revision,
      ]
        .join(' ')
        .toLowerCase();

      return rowText.includes(text);
    });
  }

  get totalPages(): number {
    const pages = Math.ceil(this.filteredProducts.length / this.pageSize);
    return pages || 1;
  }

  get paginatedProducts(): FinancialProduct[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get showingFrom(): number {
    if (this.filteredProducts.length === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredProducts.length
    );
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.currentPage = 1;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudieron cargar los productos financieros.';
      },
    });
  }

  searchProducts(): void {
    this.currentPage = 1;
  }

  changePageSize(): void {
    this.currentPage = 1;
  }

  addProduct(): void {
    this.router.navigate(['/products/new']);
  }

  editProduct(id: string): void {
    this.router.navigate(['/products/edit', id]);
  }

  askDelete(product: FinancialProduct): void {
    this.selectedProduct = product;
  }

  closeDeleteModal(): void {
    this.selectedProduct = null;
  }

  confirmDelete(): void {
    if (!this.selectedProduct) {
      return;
    }

    this.deleting = true;

    this.productsService.deleteProduct(this.selectedProduct.id).subscribe({
      next: () => {
        this.deleting = false;
        this.selectedProduct = null;
        this.loadProducts();
      },
      error: () => {
        this.deleting = false;
        this.errorMessage = 'No se pudo eliminar el producto financiero.';
      },
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  setDefaultLogo(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.src = 'https://cdn-icons-png.flaticon.com/512/633/633611.png';
  }
}