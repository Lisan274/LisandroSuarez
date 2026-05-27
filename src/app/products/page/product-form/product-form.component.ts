import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';

import { FinancialProduct } from '../../models/financial-product.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;

  isEdit = false;
  productId = '';

  isSaving = false;
  isLoading = false;
  formSubmitted = false;
  saveError = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.checkEditMode();
    this.watchReleaseDate();
  }

  private buildForm(): void {
    this.productForm = this.fb.group({
      id: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10),
          ],
          asyncValidators: [this.checkProductId.bind(this)],
          updateOn: 'blur',
        },
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, this.validReleaseDate]],
      date_revision: [{ value: '', disabled: true }, [Validators.required]],
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.isEdit = true;
    this.productId = id;
    this.loadProduct(id);
  }

  private loadProduct(id: string): void {
    this.isLoading = true;

    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.isLoading = false;

        if (!product) {
          this.saveError = 'No se encontró el producto financiero.';
          return;
        }

        this.productForm.patchValue(product);
        this.productForm.get('id')?.disable();
      },
      error: () => {
        this.isLoading = false;
        this.saveError = 'No se pudo cargar la información del producto.';
      },
    });
  }

  private watchReleaseDate(): void {
    this.productForm.get('date_release')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.productForm.get('date_revision')?.setValue('');
        return;
      }

      const releaseDate = new Date(`${value}T00:00:00`);
      const revisionDate = new Date(releaseDate);

      revisionDate.setFullYear(revisionDate.getFullYear() + 1);

      this.productForm
        .get('date_revision')
        ?.setValue(this.formatDate(revisionDate));
    });
  }

  private checkProductId(control: AbstractControl): Observable<ValidationErrors | null> {
    const id = control.value;

    if (this.isEdit || !id || id.length < 3) {
      return of(null);
    }

    return this.productsService.verifyProductId(id).pipe(
      map((exists) => (exists ? { idExists: true } : null)),
      catchError(() => of(null))
    );
  }

  private validReleaseDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(`${control.value}T00:00:00`);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { invalidReleaseDate: true };
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  hasError(field: string): boolean {
    const control = this.productForm.get(field);

    if (!control) {
      return false;
    }

    return control.invalid && (control.touched || this.formSubmitted);
  }

  getErrorMessage(field: string): string {
    const control = this.productForm.get(field);

    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es requerido';
    }

    if (control.errors['minlength']) {
      return `Debe tener mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }

    if (control.errors['maxlength']) {
      return `Debe tener máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }

    if (control.errors['idExists']) {
      return 'Este ID ya existe';
    }

    if (control.errors['invalidReleaseDate']) {
      return 'La fecha debe ser igual o mayor a la fecha actual';
    }

    return 'Campo inválido';
  }

  resetForm(): void {
    this.formSubmitted = false;
    this.saveError = '';

    if (this.isEdit) {
      this.loadProduct(this.productId);
      return;
    }

    this.productForm.reset();
  }

  saveProduct(): void {
    this.formSubmitted = true;
    this.saveError = '';

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isEdit ? this.updateProduct() : this.createProduct();
  }

  private createProduct(): void {
    const product: FinancialProduct = this.productForm.getRawValue();

    this.isSaving = true;

    this.productsService.createProduct(product).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/products']);
      },
      error: () => {
        this.isSaving = false;
        this.saveError = 'No se pudo registrar el producto financiero.';
      },
    });
  }

  private updateProduct(): void {
    const formValue = this.productForm.getRawValue();

    const product = {
      name: formValue.name,
      description: formValue.description,
      logo: formValue.logo,
      date_release: formValue.date_release,
      date_revision: formValue.date_revision,
    };

    this.isSaving = true;

    this.productsService.updateProduct(this.productId, product).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/products']);
      },
      error: () => {
        this.isSaving = false;
        this.saveError = 'No se pudo actualizar el producto financiero.';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}