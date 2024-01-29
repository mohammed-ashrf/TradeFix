import { Component, OnInit } from '@angular/core';
import { InformationService } from '../services/information.service';
import { CartService, Cart, CartItem, Buyer } from '../services/cart.service';
import { Location } from '@angular/common';
import { Dealer, ProductSection } from '../shared/information';
import { Product, ProductsQuery } from '../shared/products';
import { MatDialog } from '@angular/material/dialog';
import { CartDialogComponent } from '../cart-dialog/cart-dialog.component';
import { ProductsService } from '../services/products.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {
  carts: Cart[] = [];
  currentCart!: Cart;
  totalPrice: number = 0;
  buyerName: string = '';
  buyerPhoneNumber: string = '';
  discount: number = 0;
  userType: string = 'user';
  payType: string = 'cash';
  paid: number = 0;
  total: number = 0;
  owing: number=0;
  pastOwing:number =0;
  dollarPrice: any = 1;
  cart:any;
  cartId: number = 1;
  products!: CartItem[];
  buyers: any;
  dealers: Dealer[] = [];
  user: any;
  cartName!: string;
  searchResult: Product[] = [];
  searchproducts: Product[] = [];
  allSearchProducts: Product[] = [];
  searchTerm!: string;
  isSearched!: boolean;
  isDealersSearched: boolean = false;
  dealerSearchResult: Dealer[] = [];
  productSections: ProductSection[] = [];
  productsQuery: ProductsQuery = {
    category: '',
    status: '',
    buyerType: '',
    payType: '',
    today: false,
    thisWeek: false,
    thisMonth: false,
    thisYear: false,
    specificYear: '',
    sellerName: '',
    startDate: '',
    endDate: ''
  };
  constructor(private cartService: CartService,
    private informationService: InformationService,
    private productsService: ProductsService,
    private location: Location,
    private dialog: MatDialog,
    private router: Router,) { }

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (user) this.user = JSON.parse(user);
    this.carts = this.cartService.getCarts();
    this.currentCart = this.cartService.getCart(this.cartId);
    this.getdollarPrice();
    this.getProducts();
    this.getProductSections()
    if(this.currentCart){
      console.log(this.currentCart);
      this.paid = this.currentCart.paid;
      this.discount = this.currentCart.discount;
      this.buyerName = this.currentCart.buyerName;
      this.buyerPhoneNumber = this.currentCart.phoneNumber;
      this.payType = this.currentCart.payType;
      this.userType = this.currentCart.buyerType;
      this.totalPrice = this.currentCart.totalPrice;
      this.products = this.currentCart.products;
      this.getTotalPrice();
      this.getBuyers();
      this.getDealers();
      this.currentCart.sellerName = this.user.username;
      console.log(this.currentCart);
    }
  }

  getProducts() {
    this.productsService.getAll().subscribe(
      (products) => {
        this.searchproducts = products;
        this.allSearchProducts = products;
      }
    );
  }

  createNewCart() {
    const dialogRef = this.dialog.open(CartDialogComponent);

    dialogRef.afterClosed().subscribe(cartName => {
      if (cartName) {
        this.cartService.addCart(cartName, cartName, '', '', new Date());
        this.carts = this.cartService.getCarts();
        const cart = this.carts.find(cart => cart.cartName === cartName);
        if (cart) {
          this.currentCart = cart;
        }
        this.getTotalPrice();
        this.router.navigate(['/sell']);
      }
    });
  }



  getBuyers() {
    this.cartService.getBuyers().subscribe(
      (buyers) => {
        this.buyers = buyers;
      }
    )
  }
  getDealers(){
    this.informationService.getDealers().subscribe(
      (dealers) => {
        this.dealers =dealers;
      }
    )
  }

  goBack() {
    this.location.back();
  }
  
 

  onCartChange(cartId: number) {
    console.log('changed' + cartId)
    const cart = this.cartService.getCart(cartId);
    if (cart) {
      this.currentCart = cart;
      this.products = cart.products;
      this.buyerName = cart.buyerName;
      this.buyerPhoneNumber = this.currentCart.phoneNumber;
      this.userType = this.currentCart.buyerType;
      this.payType = this.currentCart.payType;
      this.discount = this.currentCart.discount;
      this.paid = this.currentCart.paid;
      this.totalPrice = this.currentCart.totalPrice;
      this.total = this.currentCart.total;
      console.log(this.currentCart);
      this.getTotalPrice();
    }
  }

  updateCartItemQuantity(cartItem: CartItem) {
    try {
      this.cartService.updateProductQuantity(this.currentCart.id - 1, this.currentCart.products.indexOf(cartItem), cartItem.quantity, this.userType);
      this.getTotalPrice();
    } catch (e : any) {
      alert(e.message);
    }
  }

  deleteCartItem(cartItem: CartItem) {
    this.cartService.deleteProduct(this.currentCart.id - 1, this.currentCart.products.indexOf(cartItem));
    this.currentCart = this.cartService.getCart(this.currentCart.id - 1);
    this.getTotalPrice();
  }

  deleteCart() {
    this.cartService.deleteCart(this.currentCart.id);
    this.router.navigate(['/sell']);
  }

  updateCartInformation() {
    console.log('started');
    let buyer = this.cartService.searchBuyers(this.buyers, this.buyerName);
    this.currentCart.products = this.products;
    this.currentCart.buyerName = this.buyerName;
    this.currentCart.phoneNumber = this.buyerPhoneNumber;
    this.currentCart.buyerType = this.userType;
    this.currentCart.payType = this.payType;
    this.currentCart.paid = this.paid;
    this.currentCart.discount = this.discount;
    this.currentCart.totalPrice = this.totalPrice;
    this.currentCart.sellerName = this.user.username;
    if (buyer.length !== 0) {
      if (this.buyerName !== '') {
        let carts = buyer[buyer.length - 1].carts;
        this.currentCart.pastOwing = carts[carts.length - 1].owing;
      }else {
        this.currentCart.pastOwing = 0;
      }
      this.currentCart.total = (this.totalPrice - this.discount) + this.currentCart.pastOwing;
      this.currentCart.owing = this.currentCart.total - this.paid;
      this.cartService.updateCart(this.currentCart.id - 1, this.currentCart);
      console.log("finished, buyers founded");
      this.getTotalPrice();
    }else {
      this.currentCart.pastOwing = 0;
      this.currentCart.total = (this.totalPrice - this.discount) + this.currentCart.pastOwing;
      this.currentCart.owing = this.currentCart.total - this.paid;
      this.cartService.updateCart(this.currentCart.id - 1, this.currentCart);
      console.log("finished, no buyers");
      this.getTotalPrice();
    }
  }

  getTotalPrice() {
    let total = 0;
    for (const item of this.currentCart.products) {
      // let price = this.userType === 'user' ? item.product.userSellingPrice : item.quantity >= 3 ? item.product.deallerSellingPriceAll : item.product.deallerSellingPrice;
      let price = item.product.price;
      total += price * item.quantity;
    }
    this.totalPrice = total * this.dollarPrice;
    this.total = (this.totalPrice - this.discount) + this.pastOwing ;
    this.owing = this.total - this.paid;
  }

  getdollarPrice() {
    this.informationService.getDollatPrice().subscribe(
      (dollar) => {
        let index = 'price';
        this.dollarPrice = dollar[index as keyof typeof dollar];
        console.log(this.dollarPrice);
      }
    )
  }
  getProductSections() {
    this.informationService.getProductSections().subscribe(
      (productSections) => {
        this.productSections = productSections;
      }
    )
  }

  searchProducts(products: any[], userInput: string) {
    try {
      if (typeof userInput !== 'string') {
        console.log('User input must be a string');
        throw new Error('User input must be a string');
      }
      userInput = userInput.toLowerCase();
      return products.filter(product => {
        return product.name.toLowerCase().includes(userInput);
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  testInput(str: string) {
    return /[A-Za-z0-9\s\S]+/.test(str);
  }

  onSearch() {
      this.searchResult = this.searchProducts(this.searchproducts, this.searchTerm);
      this.isSearched = true;
  }

  searchDealers() {
    this.dealerSearchResult = this.searchProducts(this.dealers, this.buyerName);
    this.isDealersSearched = true;
  }

  onSelectDealer(item: Dealer) {
    this.buyerName = item.name;
    this.buyerPhoneNumber = item.phone;
    this.isDealersSearched = false;
    this.updateCartInformation();
  }

  onSelect(item: Product) {
    try {
      this.cartService.addProduct(this.cartId,item,1, 'user');
      console.log(`Added ${item.name} to cart`);
      this.isSearched = false;
      this.searchTerm = '';
    } catch (e : any) {
      alert(e.message);
      console.log(e);
    }
  }

  async sellCart(){
    this.updateCartInformation();
    const cart = this.currentCart;
    await this.cartService.sellCart(cart).subscribe(
      () => {
        this.deleteCart();
      }
    )
  }

  filterProducts() {
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
    const base = {
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
    };
    if (filterCriteria === base) {
      this.searchproducts = this.allSearchProducts;
    }else {
      const products = this.productsService.filterProducts(this.allSearchProducts, filterCriteria);
      this.searchproducts = products;
      this.searchResult = products;
    }
  }
}