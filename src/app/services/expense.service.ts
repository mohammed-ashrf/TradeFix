import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Expense {
  name: string;
  expenses: { amount: number; date: Date }[];
}
@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/api/expenses`;
  
  constructor(private http: HttpClient) { }

  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  getExpenses(startDate?: string, endDate?: string): Observable<Expense[]> {
    let params = {};
    if (startDate && endDate) {
      params = { startDate, endDate };
    }
    return this.http.get<Expense[]>(`${this.apiUrl}/filter`, { params });
  }

  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }
    
}
