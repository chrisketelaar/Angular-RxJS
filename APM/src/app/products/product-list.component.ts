import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  map,
} from 'rxjs';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnDestroy {
  pageTitle = 'Product List';
  errorMessage = '';

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError((errorMessage) => {
      this.errorMessage = errorMessage;
      return EMPTY;
    })
  );

  products$ = combineLatest([
    this.productService.productsWithAdd$,
    this.categorySelectedAction$,
  ]).pipe(
    map(([products, selectedCategoryId]) =>
      products.filter((product) =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )
    ),
    catchError((errorMessage) => {
      this.errorMessage = errorMessage;
      return EMPTY;
    })
  );

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  ngOnDestroy(): void {
    this.categorySelectedSubject.complete();
  }

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
