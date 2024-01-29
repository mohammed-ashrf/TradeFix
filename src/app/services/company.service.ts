import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private baseUrl = `${environment.apiUrl}/api/companies`;
  constructor(private http: HttpClient) {}

  createCompany(companyData: FormData) {
    return this.http.post(`${this.baseUrl}/create`, companyData);
  }
}
