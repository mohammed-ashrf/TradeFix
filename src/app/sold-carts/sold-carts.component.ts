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
    thisMonth: true,
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
  searchProperty: string = 'buyerName';
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

  searchBuyers(buyers: any[], userInput: any, searchProperty: string) {
    try {
      if (typeof userInput !== 'string') {
        console.log('User input must be a string');
        throw new Error('User input must be a string');
      }
      userInput = userInput.toLowerCase();
      return buyers.filter(buyer => {
        if (buyer.hasOwnProperty(searchProperty) && buyer[searchProperty]?.toString().toLowerCase().includes(userInput)) {
          const value = buyer[searchProperty].toString().toLowerCase();
          if (value.includes(userInput)) {
            this.isSearched = true;
            return true;
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
    this.searchResult = this.searchBuyers(this.buyers, this.searchTerm, this.searchProperty);
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