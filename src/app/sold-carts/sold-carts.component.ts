import { Component, OnInit } from '@angular/core';
import { CartService, Buyer, Cart } from '../services/cart.service';
import { ProductsQuery } from '../shared/products';
import { InformationService } from '../services/information.service';
import { ProductSection } from '../shared/information';
import { Location } from '@angular/common';
@Component({
  selector: 'app-sold-carts',
  templateUrl: './sold-carts.component.html',
  styleUrls: ['./sold-carts.component.scss']
})
export class SoldCartsComponent implements OnInit {

  buyers: Buyer[] = [];
  moneyEarned: number = 0;
  allBuyers: Buyer[] = [];
  productSections: ProductSection[] = [];
  selectedTimePeriod: string = 'today';
  specificYear: number = new Date().getFullYear();
  cartsQuery: ProductsQuery = {
    category: '',
    payType: '',
    buyerType: '',
    sellerName: '',
    today: false,
    thisMonth: false,
    thisYear: false,
    specificYear: '',
    status: '',
    startDate: '',
    endDate: '',
    thisWeek: false
  }
  isSearched!: boolean;
  searchResult: any;
  searchTerm!: string;
  
  constructor(private cartService: CartService,
    private informationService: InformationService,
    private location:Location) { }

  ngOnInit(): void {
    this.getInformations();
    this.getBuyers();
  }

  getBuyers() {
    this.cartService.getBuyers().subscribe(
      (buyers) => {
        this.allBuyers = buyers;
        this.buyers = buyers;
        this.filterCarts();
      }
    );
  }

  getInformations() {
    this.informationService.getProductSections().subscribe(
      (productSections) => {
        this.productSections = productSections;
      }
    )
  }
  goBack() {
      this.location.back()
  }
  searchBuyers(devices: any[], userInput: any) {
    try {
      if (typeof userInput !== 'string') {
        console.log('User input must be a string');
        throw new Error('User input must be a string');
      }
      userInput = userInput.toLowerCase();
      return devices.filter(buyer => {
        for (let key in buyer) {
          if (buyer.hasOwnProperty(key) && buyer[key]?.toString().toLowerCase().includes(userInput.toLowerCase())) {
            const value = buyer[key].toString().toLowerCase();
            if (value.includes(userInput)) {
              this.isSearched = true;
              return true;
            }
            break;
          }
        }
        return false;
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  testInput(str: string) {
    return /[A-Za-z0-9\s\S]+/.test(str);
  }

  search() {
      this.searchResult = this.searchBuyers(this.buyers, this.searchTerm);
      console.log(this.searchResult);
  }


  filterCarts() {
    this.buyers = this.allBuyers;
    const filterCriteria = {
      category: this.cartsQuery.category,
      payType: this.cartsQuery.payType,
      buyerType: this.cartsQuery.buyerType,
      sellerName: this.cartsQuery.sellerName,
      status: this.cartsQuery.status,
      today: this.cartsQuery.today,
      thisWeek: this.cartsQuery.thisWeek,
      thisMonth: this.cartsQuery.thisMonth,
      thisYear: this.cartsQuery.thisYear,
      specificYear: this.cartsQuery.specificYear,
      startDate: this.cartsQuery.startDate,
      endDate: this.cartsQuery.endDate
    };
    const buyers = this.cartService.filterSoldCarts(this.allBuyers, filterCriteria);
    this.buyers = buyers;
    this.moneyEarned = buyers.reduce((total, buyer) => {
      return total + buyer.carts.reduce((subtotal, cart) => {
        return subtotal + cart.paid;
      }, 0);
    }, 0);
  }

  resetFilter():void {
    this.cartsQuery = {
      category: '',
      payType: '',
      buyerType: '',
      sellerName: '',
      today: false,
      thisMonth: false,
      thisYear: false,
      thisWeek: false,
      specificYear: '',
      status: '',
      startDate: '',
      endDate: ''
    }

    this.filterCarts();
  }
}