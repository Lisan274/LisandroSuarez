import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProductFormComponent } from './product-form.component';
import { ProductsService } from '../../services/products.service';
import { FinancialProduct } from '../../models/financial-product.model';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productsService: jasmine.SpyObj<ProductsService>;
  let router: jasmine.SpyObj<Router>;

  const product: FinancialProduct = {
    id: 'uno',
    name: 'Producto Uno',
    description: 'Descripción del producto uno',
    logo: 'https://logo.com/uno.png',
    date_release: '2026-06-01',
    date_revision: '2027-06-01',
  };

  beforeEach(async () => {
    productsService = jasmine.createSpyObj('ProductsService', [
      'verifyProductId',
      'createProduct',
      'updateProduct',
      'getProductById',
    ]);

    router = jasmine.createSpyObj('Router', ['navigate']);

    productsService.verifyProductId.and.returnValue(of(false));
    productsService.createProduct.and.returnValue(
      of({
        message: 'Producto creado correctamente',
        data: product,
      })
    );
    productsService.updateProduct.and.returnValue(
      of({
        message: 'Producto actualizado correctamente',
        data: product,
      })
    );
    productsService.getProductById.and.returnValue(of(product));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProductFormComponent],
      providers: [
        { provide: ProductsService, useValue: productsService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería crear el formulario con controles principales', () => {
    expect(component.productForm.get('id')).toBeTruthy();
    expect(component.productForm.get('name')).toBeTruthy();
    expect(component.productForm.get('description')).toBeTruthy();
    expect(component.productForm.get('logo')).toBeTruthy();
    expect(component.productForm.get('date_release')).toBeTruthy();
    expect(component.productForm.get('date_revision')).toBeTruthy();
  });
  
  it('debería marcar el formulario como inválido si está vacío', () => {
    component.saveProduct();

    expect(component.productForm.invalid).toBeTrue();
  });

  it('debería calcular la fecha de revisión un año después', () => {
    component.productForm.get('date_release')?.setValue('2026-06-01');

    expect(component.productForm.get('date_revision')?.value).toBe('2027-06-01');
  });

  it('debería crear un producto válido', () => {
    component.productForm.patchValue(product);

    component.saveProduct();

    expect(productsService.createProduct).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('debería mostrar error si falla la creación', () => {
    productsService.createProduct.and.returnValue(
      throwError(() => new Error())
    );

    component.productForm.patchValue(product);
    component.saveProduct();

    expect(component.saveError).toBe(
      'No se pudo registrar el producto financiero.'
    );
  });

  it('debería volver al listado', () => {
    component.goBack();

    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });
});