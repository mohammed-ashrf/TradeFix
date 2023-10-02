import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
export interface safeBalances { 
  balance: number, 
  productsMoney: number, 
  initialBalance: number, 
  productsMoneyAfterSelling: number ,
  totalLosses: number
}
@Injectable({
  providedIn: 'root'
})
export class SafeService {
  private apiUrl = `${environment.apiUrl}/api/safe`;

  constructor(private http: HttpClient) {}

  addMoney(amount: number, date: Date, fromWhere: string, whichUser: string) {
    return this.http.post(`${this.apiUrl}/add`, { amount, date, fromWhere, whichUser });
  }

  deductMoney(amount: number, date: Date, fromWhere: string, whichUser: string) {
    return this.http.post(`${this.apiUrl}/deduct`, { amount, date, fromWhere, whichUser });
  }

  getBalance() {
    return this.http.get(`${this.apiUrl}/balance`);
  }

  getTransactions() {
    return this.http.get(`${this.apiUrl}/transactions`);
  }

  restTodayMoney() {
    return this.http.get(`${this.apiUrl}/resetTodayMoney`);
  }
}
