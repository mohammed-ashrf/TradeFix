import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Buyer } from '../services/cart.service';
import { Cart } from '../services/cart.service';

@Component({
  selector: 'app-sold-carts',
  templateUrl: './sold-carts.component.html',
  styleUrls: ['./sold-carts.component.scss']
})
export class SoldCartsComponent implements OnInit {

  buyers: Buyer[] = [];
  moneyEarned: number = 0;
  
  timePeriods = [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'this_year', label: 'This Year' },
    { value: 'specific_year', label: 'Specific Year' },
  ];


  selectedTimePeriod: string = 'today';
  specificYear: number = new Date().getFullYear();

  constructor(private cartService: CartService){

  }

  ngOnInit(): void {
    this.getBuyers();
  }

  getBuyers() {
    this.cartService.getBuyers().subscribe(
      (buyers) => {
        this.buyers = buyers;
      }
    );
  }

  getMoneyEarned() {
    switch (this.selectedTimePeriod) {
      case 'today':
        this.moneyEarned = this.buyers.reduce((total, buyer) => {
          return total + buyer.carts.reduce((subtotal, cart) => {
            if (this.isToday(cart.date)) {
              return subtotal + cart.paid;
            } else {
              return subtotal;
            }
          }, 0);
        }, 0);
        break;
      case 'this_week':
        this.moneyEarned = this.buyers.reduce((total, buyer) => {
          return total + buyer.carts.reduce((subtotal, cart) => {
            if (this.isThisWeek(cart.date)) {
              return subtotal + cart.paid;
            } else {
              return subtotal;
            }
          }, 0);
        }, 0);
        break;
      case 'this_month':
        this.moneyEarned = this.buyers.reduce((total, buyer) => {
          return total + buyer.carts.reduce((subtotal, cart) => {
            if (this.isThisMonth(cart.date)) {
              return subtotal + cart.paid;
            } else {
              return subtotal;
            }
          }, 0);
        }, 0);
        break;
      case 'this_year':
        this.moneyEarned = this.buyers.reduce((total, buyer) => {
          return total + buyer.carts.reduce((subtotal, cart) => {
            if (this.isThisYear(cart.date)) {
              return subtotal + cart.paid;
            } else {
              return subtotal;
            }
          }, 0);
        }, 0);
        break;
      case 'specific_year':
        this.moneyEarned = this.buyers.reduce((total, buyer) => {
          return total + buyer.carts.reduce((subtotal, cart) => {
            if (this.isSpecificYear(cart.date, this.specificYear)) {
              return subtotal + cart.paid;
            } else {
              return subtotal;
            }
          }, 0);
        }, 0);
        break;
    }
  }
  
  isToday(date: Date): boolean {
    const today = new Date();
    // const cartDate = new Date(date);
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  }
  
  isThisWeek(date: Date): boolean {
    const today = new Date();
    // const cartDate = new Date(date);
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  }
  
  isThisMonth(date: Date): boolean {
    const today = new Date();
    // const cartDate = new Date(date);
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth();
  }
  
  isThisYear(date: Date): boolean {
    const today = new Date();
    // const cartDate = new Date(date);
    return date.getFullYear() === today.getFullYear();
  }
  
  isSpecificYear(date: Date, year: number): boolean {
    // const cartDate = new Date(date);
    return date.getFullYear() === year;
  }
}
