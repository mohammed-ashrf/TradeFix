import { Component, OnInit} from '@angular/core';
import { ProductsService } from '../services/products.service';
import { CartService, Cart, CartItem } from '../services/cart.service';
import { Product } from '../shared/products';
import { Router } from '@angular/router';
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
  searchResult!:any[];
  allProducts: Product[] = [];
  product: any;
  quantity = 1;
  users:any;
  user: any;
  selectedCartId: number = 0;
  
  carts: Cart[] = [];
  currentCart!: Cart;
  constructor(private productsService: ProductsService,
    private cartService: CartService,    
    private router: Router) { }

  ngOnInit() {
    localStorage.setItem("location", "products");
    this.user = localStorage.getItem('user');
    console.log(this.user);
    this.productsService.getAll().subscribe((products) => {
      this.products = products.reverse();
      this.allProducts = this.products;
      console.log(products);
    });
    this.carts = this.cartService.getCarts();
  }

  goBack() {
    var user = JSON.parse(this.user);
    if (user.role === 'receiver') {
      this.router.navigate(['/devices']);
    } else if (user.role === 'technition') {
      this.router.navigate(['/userDashboard']);
    }else {
      this.router.navigate(['/admin']);
    }
    // this.location.back();
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
}
