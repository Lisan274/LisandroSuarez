import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductActionMenuComponent } from './product-action-menu.component';

describe('ProductActionMenuComponent', () => {
  let component: ProductActionMenuComponent;
  let fixture: ComponentFixture<ProductActionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductActionMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
