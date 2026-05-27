import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { ProductsService } from '../../services/products.service';
import { FinancialProduct } from '../../models/financial-product.model';
import { ProductActionMenuComponent } from '../../components/product-action-menu/product-action-menu.component';
import { DeleteConfirmModalComponent } from '../../components/delete-confirm-modal/delete-confirm-modal.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productsService: jasmine.SpyObj<ProductsService>;
  let router: jasmine.SpyObj<Router>;

  const products: FinancialProduct[] = [
    {
      id: 'uno',
      name: 'Producto Uno',
      description: 'Descripción del producto uno',
      logo: 'https://logo.com/uno.png',
      date_release: '2026-06-01',
      date_revision: '2027-06-01',
    },
    {
      id: 'dos',
      name: 'Producto Dos',
      description: 'Descripción del producto dos',
      logo: 'https://logo.com/dos.png',
      date_release: '2026-07-01',
      date_revision: '2027-07-01',
    },
  ];

  beforeEach(async () => {
    productsService = jasmine.createSpyObj('ProductsService', [
      'getProducts',
      'deleteProduct',
    ]);

    router = jasmine.createSpyObj('Router', ['navigate']);

    productsService.getProducts.and.returnValue(of(products));
    productsService.deleteProduct.and.returnValue(
      of({ message: 'Producto eliminado correctamente' })
    );

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        ProductListComponent,
        ProductActionMenuComponent,
        DeleteConfirmModalComponent,
      ],
      providers: [
        { provide: ProductsService, useValue: productsService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los productos al iniciar', () => {
    expect(productsService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('debería filtrar productos por texto', () => {
    component.searchTerm = 'dos';

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].id).toBe('dos');
  });

  it('debería cambiar a la página siguiente', () => {
    component.pageSize = 1;
    component.currentPage = 1;

    component.nextPage();

    expect(component.currentPage).toBe(2);
  });

  it('debería regresar a la página anterior', () => {
    component.pageSize = 1;
    component.currentPage = 2;

    component.previousPage();

    expect(component.currentPage).toBe(1);
  });

  it('debería navegar al formulario de creación', () => {
    component.addProduct();

    expect(router.navigate).toHaveBeenCalledWith(['/products/new']);
  });

  it('debería navegar al formulario de edición', () => {
    component.editProduct('uno');

    expect(router.navigate).toHaveBeenCalledWith(['/products/edit', 'uno']);
  });

  it('debería seleccionar un producto para eliminar', () => {
    component.askDelete(products[0]);

    expect(component.selectedProduct?.id).toBe('uno');
  });

  it('debería cerrar el modal de eliminación', () => {
    component.selectedProduct = products[0];

    component.closeDeleteModal();

    expect(component.selectedProduct).toBeNull();
  });

  it('debería eliminar un producto seleccionado', () => {
    component.selectedProduct = products[0];

    component.confirmDelete();

    expect(productsService.deleteProduct).toHaveBeenCalledWith('uno');
    expect(component.selectedProduct).toBeNull();
  });

  it('debería mostrar error si falla la carga de productos', () => {
    productsService.getProducts.and.returnValue(throwError(() => new Error()));

    component.loadProducts();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe(
      'No se pudieron cargar los productos financieros.'
    );
  });
});