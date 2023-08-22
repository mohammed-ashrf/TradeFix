import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';


import { environment } from '../../environments/environment';
import { Product, SoldProduct,PurchasedProduct, ProductsQuery } from '../shared/products';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getOne(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  purchaseProducts(products: any[]) {
    return this.http.post(`${this.apiUrl}/purchase`, { products });
  }
  sellProducts(products: SoldProduct[]): Observable<PurchasedProduct[]> {
    const url = `${this.apiUrl}/purchase`;
    const requestBody = { products };
    return this.http.post<PurchasedProduct[]>(url, requestBody);
  }

  // Define other methods as needed


  // searchProducts(query: string): Observable<Product[]> {
  //   const url = `${this.apiUrl}/search?q=${query}`;
  //   return this.http.get<Product[]>(url);
  // }

  searchProducts(query: string): Observable<any> {
    const searchUrl = `${this.apiUrl}/search?q=${query}`;
    
    return this.http.get(searchUrl).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  filterProducts(Products: Product[], query: ProductsQuery): Product[] {
    return Products.filter(product => {
      const now = new Date();
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      const deviceReceivingDate = new Date(product.suppliers[0].purchasedate);
  
      // Check if the device's receiving date is within the specified date range
      const isWithinDateRange =
        (!query.startDate || deviceReceivingDate >= new Date(query.startDate)) &&
        (!query.endDate || deviceReceivingDate <= new Date(query.endDate));
  
      return (
        isWithinDateRange &&
        (!query.category || product.category === query.category) &&
        (!query.status || product.status === query.status) &&
        (!query.thisWeek || deviceReceivingDate >= oneWeekAgo) &&
        (!query.today || deviceReceivingDate.toDateString() === new Date().toDateString()) &&
        (!query.thisMonth || deviceReceivingDate.getMonth() === new Date().getMonth()) &&
        (!query.thisYear || deviceReceivingDate.getFullYear() === new Date().getFullYear()) &&
        (!query.specificYear || deviceReceivingDate.getFullYear() === parseInt(query.specificYear))
      );
    });
  }
}
