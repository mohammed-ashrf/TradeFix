import { Component, OnInit } from '@angular/core';
import { SafeService } from '../services/safe.service';
import { User } from '../auth/user';

@Component({
  selector: 'app-safe',
  templateUrl: './safe.component.html',
  styleUrls: ['./safe.component.scss']
})
export class SafeComponent implements OnInit {
  balance!: number;
  initialBalance!: number;
  productsBalance!: number;
  productsAfterSellingBalance!: number;
  todayBalance!: number;
  totalLossesMoney!: number;
  transactions: any[] = [];
  addFromWhere!: string;
  deductFromWhere!: string;
  addAmount: number = 0;
  deductAmount: number = 0;

  user!: User;
  
  constructor(private safeService: SafeService) {}

  ngOnInit() {
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
    this.getSafeBalance();
    this.getTransactionHistory();
  }

  getSafeBalance() {
    this.safeService.getBalance()
      .subscribe((response: any) => {
        this.balance = response.balance;
        this.todayBalance = response.todayBalance;
        this.initialBalance = response.initialBalance;
        this.productsBalance = response.productsMoney;
        this.productsAfterSellingBalance = response.productsMoneyAfterSelling;
        this.totalLossesMoney = response.totalLosses;
      });
  }

  getTransactionHistory() {
    this.safeService.getTransactions()
      .subscribe((response: any) => {
        this.transactions = response.transactions;
      });
  }

  addMoney() {
    const currentDate = new Date();
    this.safeService.addMoney(this.addAmount, currentDate, this.addFromWhere,  `${this.user.username}, (${this.user._id})`)
      .subscribe(() => {
        this.getSafeBalance();
        this.getTransactionHistory();
      });
  }

  deductMoney() {
    const currentDate = new Date();
    this.safeService.deductMoney(this.deductAmount, currentDate, this.deductFromWhere,  `${this.user.username}, (${this.user._id})`)
      .subscribe(() => {
        this.getSafeBalance();
        this.getTransactionHistory();
      });
  }
}
