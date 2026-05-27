import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductsService } from './products.service';
import { environment } from 'src/environments/environments';
import { FinancialProduct } from '../models/financial-product.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/products`;

  const product: FinancialProduct = {
    id: 'uno',
    name: 'Producto Uno',
    description: 'Descripción del producto uno',
    logo: 'https://logo.com/image.png',
    date_release: '2026-06-01',
    date_revision: '2027-06-01',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener los productos', () => {
    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].id).toBe('uno');
    });

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('GET');

    request.flush({
      data: [product],
    });
  });

  it('debería crear un producto', () => {
    service.createProduct(product).subscribe((response) => {
      expect(response.data.id).toBe('uno');
    });

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(product);

    request.flush({
      message: 'Producto creado correctamente',
      data: product,
    });
  });

  it('debería actualizar un producto', () => {
    const productUpdate = {
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.date_release,
      date_revision: product.date_revision,
    };

    service.updateProduct(product.id, productUpdate).subscribe((response) => {
      expect(response.data.id).toBe('uno');
    });

    const request = httpMock.expectOne(`${apiUrl}/${product.id}`);

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(productUpdate);

    request.flush({
      message: 'Producto actualizado correctamente',
      data: product,
    });
  });

  it('debería eliminar un producto', () => {
    service.deleteProduct(product.id).subscribe((response) => {
      expect(response.message).toBe('Producto eliminado correctamente');
    });

    const request = httpMock.expectOne(`${apiUrl}/${product.id}`);

    expect(request.request.method).toBe('DELETE');

    request.flush({
      message: 'Producto eliminado correctamente',
    });
  });

  it('debería verificar si existe un ID', () => {
    service.verifyProductId(product.id).subscribe((exists) => {
      expect(exists).toBeTrue();
    });

    const request = httpMock.expectOne(`${apiUrl}/verification/${product.id}`);

    expect(request.request.method).toBe('GET');

    request.flush(true);
  });
});