import { Component, OnInit} from '@angular/core';
import { ProductsService } from '../services/products.service';
import { CartService, Cart } from '../services/cart.service';
import { Product, ProductsQuery } from '../shared/products';
import { User } from '../auth/user';
import { Location } from '@angular/common';
import { InformationService } from '../services/information.service';
import { ProductSection } from '../shared/information';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  searchTerm!: any;
  searchResults!: any[];
  products :Product[] = [];
  isSearched:boolean = false;
  searchResult:Product[] = [];
  allProducts: Product[] = [];
  product: any;
  quantity = 1;
  currentUser: any;
  user!: User;
  selectedCartId: number = 1;
  isAdmin:boolean = false;
  carts: Cart[] = [];
  currentCart!: Cart;
  isProducts: boolean = false;
  dollarPrice!: number;
  productsQuery: ProductsQuery = {
    category: '',
    status: '',
    buyerType: '',
    payType: '',
    today: false,
    thisWeek: false,
    thisMonth: true,
    thisYear: false,
    specificYear: '',
    sellerName: '',
    startDate: '',
    endDate: ''
  };
  productSections: ProductSection[] = [];
  constructor(private productsService: ProductsService,
    private cartService: CartService,    
    private location: Location,
    private informationService: InformationService) { }

  ngOnInit() {
    localStorage.setItem("location", "products");
    this.currentUser = localStorage.getItem('user');
    this.user = JSON.parse(this.currentUser);
    this.getInformations();
    this.productsService.getAll().subscribe((products) => {
      this.products = products.reverse();
      this.allProducts = this.products;
      this.isProducts = true;
      console.log(products);
    });
    this.carts = this.cartService.getCarts();
    if(this.user.role === 'admin'){
      this.isAdmin = true;
    }
  }
  getInformations() {
    this.informationService.getProductSections().subscribe(
      (productSections) => {
        this.productSections = productSections;
      }
    )
    this.informationService.getDollatPrice().subscribe(
      (dollar) => {
        let index = 'price';
        this.dollarPrice = dollar[index as keyof typeof dollar];
        console.log(this.dollarPrice);
      }
    )
  }

  goBack() {
    this.location.back();
  }
  searchProducts(products: any[], userInput: any) {
    try {
      if (typeof userInput !== 'string') {
        console.log('User input must be a string');
        throw new Error('User input must be a string');
      }
      userInput = userInput.toLowerCase();
      return products.filter(product => {
        for (let key in product) {
          if (product.hasOwnProperty(key) && product[key]?.toString().toLowerCase().includes(userInput.toLowerCase())) {
            // this.searchResults.push(device);
            const value = product[key].toString().toLowerCase();
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
      this.searchResult = this.searchProducts(this.products, this.searchTerm);
  }

  onChange(){
    console.log(this.selectedCartId);
  }

  addToCart(product: Product) {
    try {
      this.cartService.addProduct(this.selectedCartId,product,this.quantity, 'user');
      console.log(`Added ${product.name} to cart`);
      alert(`Added ${product.name} to cart`);
    } catch (e : any) {
      alert(e.message);
      console.log(e);
    }
  }

  filterProducts() {
    this.products = this.allProducts;
    const filterCriteria = {
      category: this.productsQuery.category,
      payType: this.productsQuery.payType,
      buyerType: this.productsQuery.buyerType,
      sellerName: this.productsQuery.sellerName,
      status: this.productsQuery.status,
      today: this.productsQuery.today,
      thisWeek: this.productsQuery.thisWeek,
      thisMonth: this.productsQuery.thisMonth,
      thisYear: this.productsQuery.thisYear,
      specificYear: this.productsQuery.specificYear,
      startDate: this.productsQuery.startDate,
      endDate: this.productsQuery.endDate
    };
    const products = this.productsService.filterProducts(this.allProducts, filterCriteria);
    this.products = products;
  }

  resetFilter():void {
    this.productsQuery = {
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
    this.filterProducts();
  }
}
