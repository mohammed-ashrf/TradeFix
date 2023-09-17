import { Component, OnInit} from '@angular/core';
import { ProductsService } from '../services/products.service';
import { CartService, Cart } from '../services/cart.service';
import { Product, ProductsQuery } from '../shared/products';
import { User } from '../auth/user';
import { Location } from '@angular/common';
import { InformationService } from '../services/information.service';
import { ProductSection } from '../shared/information';
import { LossesService, loss } from '../services/losses.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  searchTerm!: string;
  products :Product[] = [];
  allFileterdProducts: Product[] = [];
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
    thisMonth: false,
    thisYear: false,
    specificYear: '',
    sellerName: '',
    startDate: '',
    endDate: ''
  };
  productSections: ProductSection[] = [];
  searchProperty: string = "name";
  itemToload: number = 0;
  constructor(private productsService: ProductsService,
    private cartService: CartService,    
    private location: Location,
    private informationService: InformationService,
    private lossesService: LossesService) { }

  ngOnInit() {
    localStorage.setItem("location", "products");
    this.currentUser = localStorage.getItem('user');
    if (this.currentUser) {
      this.user = JSON.parse(this.currentUser);
    }
    this.getInformations();
    this.getAllProducts();
    this.carts = this.cartService.getCarts();
    if(this.user.role === 'admin'){
      this.isAdmin = true;
    }
    this.loadProductsOnScroll();
  }

  loadProductsOnScroll() {
    const cardsContainer =  document.getElementById('table-container');
    if (cardsContainer) {
      cardsContainer.addEventListener('scroll', event => {
        const { scrollHeight, scrollTop, clientHeight } = (event.target as Element);

        if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
            console.log('scrolled');
            if (this.allFileterdProducts.length > this.searchResult.length) {
              this.itemToload += 10;
              this.searchResult = this.allFileterdProducts.slice(0, this.itemToload);
              console.log(' scrolling loaded');
            }
        }
      });
    }
  }

  getAllProducts() {
    this.productsService.getAll().subscribe((products) => {
      this.products = products.reverse();
      this.allProducts = this.products;
      this.filterProducts();
      this.isProducts = true;
      console.log(products);
    });
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
  searchProducts(products: any[], userInput: any, searchProperty: string) {
    try {
      if (typeof userInput !== 'string') {
        console.log('User input must be a string');
        throw new Error('User input must be a string');
      }
      userInput = userInput.toLowerCase();
      return products.filter(product => {
        if (product.hasOwnProperty(searchProperty) && product[searchProperty]?.toString().toLowerCase().includes(userInput)) {
          this.isSearched = true;
          return true;
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

  loadProducts() {
    this.itemToload = 10;
    this.searchResult = this.allFileterdProducts.slice(0, this.itemToload);
    console.log('esleLoaded');
  }

  search() {
      this.searchResult = this.searchProducts(this.products, this.searchTerm, this.searchProperty);
      console.log(this.searchResult.length);
      this.allFileterdProducts = this.searchResult;
      this.loadProducts();
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
      this.products = this.allProducts;
    }else {
      const products = this.productsService.filterProducts(this.allProducts, filterCriteria);
      this.products = products;
      this.searchResult = products;
    }
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

  addLoss(product: Product) {
    let loss : loss = {
      name: `${product.name} ( ${product._id} )`,
      description: `${product.name} with id (${product._id}) has been lost from the products with last purchase price ${product.suppliers[product.suppliers.length - 1].purchasePrice}, and purchase date ${product.suppliers[product.suppliers.length - 1].purchasedate}`,
      amount: product.suppliers[product.suppliers.length - 1].purchasePrice,
      who: `${this.user.username}, ( ${this.user._id} )`,
      createdAt: new Date()
    }
    this.lossesService.createLoss(loss).subscribe(
      (loss) => {
        console.log(`loss is added ${loss.name}`);
      }
    )
  }
}
