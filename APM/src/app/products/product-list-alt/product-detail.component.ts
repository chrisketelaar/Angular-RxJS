import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, combineLatest, EMPTY, filter, map } from 'rxjs';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  errorMessage = '';

  product$ = this.productService.selectedProduct$.pipe(
    catchError((errorMessage) => {
      this.errorMessage = errorMessage;
      return EMPTY;
    })
  );

  pageTitle$ = this.product$.pipe(
    map((product) =>
      product ? `Product Detail: ${product.productName}` : null
    )
  );

  productSuppliers$ = this.productService.selectedProductSuppliers$.pipe(
    catchError((errorMessage) => {
      this.errorMessage = errorMessage;
      return EMPTY;
    })
  );

  vm$ = combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitle$,
  ]).pipe(
    filter(([product]) => Boolean(product)),
    map(([product, productSuppliers, pageTitle]) => ({
      product,
      productSuppliers,
      pageTitle,
    }))
  );

  constructor(private productService: ProductService) {}
}
