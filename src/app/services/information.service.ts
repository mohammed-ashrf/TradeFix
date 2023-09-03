import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Section, ProductSection,Supplier,Dealer, DollarPrice, SupplierProducts } from '../shared/information';  
@Injectable({
  providedIn: 'root'
})
export class InformationService {
  private apiUrl = `${environment.apiUrl}/api`;
  constructor(private http: HttpClient) { }

  getSections(): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.apiUrl}/sections`);
  }

  getOneSection(id: string): Observable<Section> {
    return this.http.get<Section>(`${this.apiUrl}/sections/${id}`);
  }

  addSection(section : Section): Observable<Section> {
    return this.http.post<Section>(`${this.apiUrl}/sections`, section);
  }

  updateSection(id: string, section: Section): Observable<Section> {
    return this.http.put<Section>(`${this.apiUrl}/sections/${id}`, section);
  }

  deleteSection(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sections/${id}`);
  }

  getProductSections(): Observable<ProductSection[]> {
    return this.http.get<ProductSection[]>(`${this.apiUrl}/product-sections`);
  }

  getOneProductSection(id: string): Observable<ProductSection> {
    return this.http.get<ProductSection>(`${this.apiUrl}/product-sections/${id}`);
  }

  addProductSection(section : ProductSection): Observable<ProductSection> {
    return this.http.post<ProductSection>(`${this.apiUrl}/product-sections`, section);
  }

  updateProductSection(id: string, section: ProductSection): Observable<ProductSection> {
    return this.http.put<ProductSection>(`${this.apiUrl}/product-sections/${id}`, section);
  }

  deleteProductSection(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/product-sections/${id}`);
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}/suppliers`);
  }

  getOneSupplier(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/suppliers/${id}`);
  }

  addSupplier(supplier : Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.apiUrl}/suppliers`, supplier);
  }

  updateSupplier(id: string, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/suppliers/${id}`, supplier);
  }
  updateSupplierProducts(id: string, productId: string, product: SupplierProducts): Observable<Supplier> {
    const requestBody = {
      productId: productId,
      product: product
    };
  
    return this.http.put<Supplier>(`${this.apiUrl}/supplierProducts/${id}`, requestBody);
  }

  deleteSupplier(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/dealers/${id}`);
  }

  getDealers(): Observable<Dealer[]> {
    return this.http.get<Dealer[]>(`${this.apiUrl}/dealers`);
  }

  getOneDealer(id: string): Observable<Dealer> {
    return this.http.get<Dealer>(`${this.apiUrl}/dealers/${id}`);
  }

  addDealer(dealer : Dealer): Observable<Dealer> {
    return this.http.post<Dealer>(`${this.apiUrl}/dealers`, dealer);
  }

  updateDealer(id: string, dealer: Dealer): Observable<Dealer> {
    return this.http.put<Dealer>(`${this.apiUrl}/dealers/${id}`, dealer);
  }

  deleteDealer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/dealers/${id}`);
  }

  getDollatPrice(): Observable<DollarPrice> {
    return this.http.get<DollarPrice>(`${this.apiUrl}/dollar-price`);
  }
  getOneDollarPrice(id: string): Observable<DollarPrice> {
    return this.http.get<DollarPrice>(`${this.apiUrl}/dollar-price/${id}`);
  }

  addDollarPrice(dollar : DollarPrice): Observable<DollarPrice> {
    return this.http.post<DollarPrice>(`${this.apiUrl}/dollar-price`, dollar);
  }

  updateDollatPrice(id: string, dealer: DollarPrice): Observable<DollarPrice> {
    return this.http.put<DollarPrice>(`${this.apiUrl}/dollar-price/${id}`, dealer);
  }

  deleteDollatPrice(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/dollar-price/${id}`);
  }
}
