import { Injectable } from '@angular/core';
import { Product, ProductsQuery } from '../shared/products';
import { ProductsService } from './products.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  id: number;
  cartName: string;
  buyerName: string;
  phoneNumber: string;
  totalPrice: number;
  discount: number;
  pastOwing: number;
  total: number;
  paid: number;
  owing: number;
  sellerName: string;
  payType: string;
  buyerType: string;
  date: Date;
  products: CartItem[];
}

export interface Buyer {
  _id: '';
  buyerName: string;
  phoneNumber: string;
  carts: Cart[];
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  carts: Cart[] = [];

  private apiUrl = `${environment.apiUrl}/api/sold-carts`;
  private apiUrl2 = `${environment.apiUrl}/api/buyers`;

  constructor(private http: HttpClient,
    private productsService: ProductsService) {
    this.loadCartsFromLocalStorage();
  }

  addCart(cartName: string, buyerName: string, phoneNumber: string, sellerName: string, date: Date) {
    const newCart: Cart = {
      id: this.carts.length + 1,
      cartName,
      buyerName,
      phoneNumber,
      totalPrice: 0,
      discount:0,
      pastOwing:0,
      total:0,
      paid:0,
      owing: 0,
      sellerName,
      payType: 'cash',
      buyerType: 'user',
      date,
      products: []
    };
    this.carts.push(newCart);
    this.saveCartsToLocalStorage();
  }

  

  addProduct(cartIndex: number, product: Product, quantity: number, buyerType: string) {
    const cart = this.carts[cartIndex - 1];
    const existingCartItem = cart.products.find(item => item.product._id === product._id);
    let price = product.userSellingPrice;

    // Apply pricing rules based on buyer type and quantity
    if (buyerType === 'dealer') {
      price = product.deallerSellingPrice;
      if (quantity >= 3) {
        price = product.deallerSellingPriceAll;
      }
    } else if (buyerType === 'user') {
      price = product.userSellingPrice;
    }

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > existingCartItem.product.quantity) {
        throw new Error(`Not enough stock for ${existingCartItem.product.name}. Available stock: ${existingCartItem.product.quantity}`);
      }
      existingCartItem.quantity = newQuantity;
      existingCartItem.totalPrice += price * quantity;
      existingCartItem.product.quantity -= quantity; // update the current quantity of the product
      existingCartItem.product.quantitySold += quantity; // update the quantity sold of the product
    } else {
      if (quantity > product.quantity) {
        throw new Error(`Not enough stock for ${product.name}. Available stock: ${product.quantity}`);
      }
      const newCartItem: CartItem = {
        product,
        quantity,
        totalPrice: price * quantity
      };
      cart.products.push(newCartItem);
      product.quantity -= quantity;
      product.quantitySold += quantity; // update the quantity sold of the product
    }
    cart.totalPrice += price * quantity;
    const lastCart = this.carts.slice().reverse().find(c => c.phoneNumber === cart.phoneNumber && c.id !== cart.id);
    const pastOwing = lastCart ? lastCart.owing : 0;
    // cart.pastOwing = 0;
    cart.total = (cart.totalPrice - cart.discount) + pastOwing;
    cart.owing = cart.total - cart.paid;
    this.productsService.update(product._id, product);
    this.saveCartsToLocalStorage();
  }

  updateProductQuantity(cartIndex: number, productIndex: number, quantity: number, buyerType: string) {
    const cart = this.carts[cartIndex];
    const cartItem = cart.products[productIndex];
    const oldQuantity = cartItem.quantity;
    const oldTotalPrice = cartItem.totalPrice;
    let price = cartItem.product.userSellingPrice;

    // Apply pricing rules based on buyer type and quantity
    if (buyerType === 'dealer') {
      price = cartItem.product.deallerSellingPrice;
      if (quantity >= 3) {
        price = cartItem.product.deallerSellingPrice;
      }
    } else if (buyerType === 'user') {
      price = cartItem.product.userSellingPrice;
    }

    cartItem.quantity = quantity;
    cartItem.totalPrice = price * quantity;
    cart.totalPrice += cartItem.totalPrice - oldTotalPrice;
    cart.total = (cart.totalPrice - cart.discount) + cart.pastOwing;
    cart.owing = cart.total - cart.paid;
    const product = cartItem.product;
    product.quantity -= quantity - oldQuantity; // update the current quantity of the product
    product.quantitySold += quantity - oldQuantity; // update the quantity sold of the product
    this.productsService.update(product._id, product);
    this.saveCartsToLocalStorage();
  }

  updateCart(cartIndex: number, cart: Cart) {
    this.carts[cartIndex] = cart;
    this.saveCartsToLocalStorage();
  }

  deleteProduct(cartIndex: number, productIndex: number) {
    const cart = this.carts[cartIndex];
    const deletedProduct = cart.products.splice(productIndex, 1)[0];
    cart.totalPrice -= deletedProduct.totalPrice;
    cart.total = (cart.totalPrice - cart.discount) + cart.pastOwing;
    cart.owing = cart.total - cart.paid;
    const product = deletedProduct.product;
    product.quantity += deletedProduct.quantity;
    product.quantitySold -= deletedProduct.quantity; // subtract the sold quantity from the quantity sold of the product
    this.productsService.update(product._id, product);
    this.saveCartsToLocalStorage();
  }

  deleteCart(cartIndex: number) {
      // Remove the cart at the specified index
      this.carts.splice(cartIndex -1 , 1);

      // Update the IDs of the remaining carts
      // Start at 1 and increment by 1 for each cart
      for (let i = 0; i < this.carts.length; i++) {
        this.carts[i].id = i + 1;
      }

      // Save the updated carts to local storage
      this.saveCartsToLocalStorage();
  }

  getCart(cartIndex: number) {
    return this.carts[cartIndex - 1];
  }
  getCartByName(cartName : string) {
    return this.carts.find(cart => cart.cartName === cartName);
  }
  getCarts() {
    return this.carts;
  }

  updatePaid(cartIndex: number, paid: number) {
    const cart = this.carts[cartIndex];
    cart.paid = paid;
    cart.owing = cart.total - paid;
    this.saveCartsToLocalStorage();
  }

  getCartProducts(cartIndex: number) {
    return this.carts[cartIndex].products;
  }

  getCartNames() {
    return this.carts.map(cart => cart.cartName);
  }

  saveCartsToLocalStorage() {
    localStorage.setItem('carts', JSON.stringify(this.carts));
    console.log(this.carts);
  }

  loadCartsFromLocalStorage() {
    const savedCarts = localStorage.getItem('carts');
    if (savedCarts) {
      this.carts = JSON.parse(savedCarts);
    }
  }

  getSoldCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}`);
  }

  getSoldCartById(id: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${id}`);
  }

  deleteSoldCartById(id: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/${id}`);
  }

  updateSoldCartById(id: string, data: Cart): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/${id}`, data);
  }

  // sellCart(data: Cart): Observable<Cart> {
  //   return this.http.post<Cart>(this.apiUrl, data);
  // }
  
  
  getBuyers(): Observable<Buyer[]> {
    return this.http.get<Buyer[]>(`${this.apiUrl2}`);
  }

  getBuyerById(id: string): Observable<Buyer> {
    return this.http.get<Buyer>(`${this.apiUrl2}/${id}`);
  }

  deleteBuyerById(id: string): Observable<Buyer> {
    return this.http.delete<Buyer>(`${this.apiUrl2}/${id}`);
  }

  updateBuyerById(id: string, data: Buyer): Observable<Buyer> {
    return this.http.put<Buyer>(`${this.apiUrl2}/${id}`, data);
  }

  sellCart(data: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl2, data);
  }

  searchBuyers(buyers: Buyer[], userInput: string) {
    try {
      if (typeof userInput !== 'string') {
        console.log('User input must be a string');
        throw new Error('User input must be a string');
      }
      userInput = userInput.toLowerCase();
      return buyers.filter(buyer => {
        return buyer.buyerName.toLowerCase().includes(userInput);
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  filterSoldCarts(buyers: Buyer[], query: ProductsQuery): Buyer[] {
    const now = new Date();
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    
    // Filter the buyers and their carts
    return buyers.filter((buyer: Buyer) => {
      const filteredBuyerCarts = buyer.carts.filter((cart: Cart) => {
        const deviceReceivingDate = new Date(cart.date);
  
        // Check if the cart falls within the given date range (startDate to endDate)
        const isWithinDateRange =
          (!query.startDate || deviceReceivingDate >= new Date(query.startDate)) &&
          (!query.endDate || deviceReceivingDate <= new Date(query.endDate));
  
        return (
          isWithinDateRange &&
          (!query.category || cart.products.every((item) => item.product.category === query.category)) &&
          (!query.status || cart.products.every((item) => item.product.status === query.status)) &&
          (!query.payType || cart.payType === query.payType) &&
          (!query.buyerType || cart.buyerType === query.buyerType) &&
          (!query.sellerName || cart.sellerName === query.sellerName) &&
          (!query.today || deviceReceivingDate.toDateString() === now.toDateString()) &&
          (!query.thisMonth || deviceReceivingDate.getMonth() === now.getMonth()) &&
          (!query.thisYear || deviceReceivingDate.getFullYear() === now.getFullYear()) &&
          (!query.specificYear || deviceReceivingDate.getFullYear() === parseInt(query.specificYear))
        );
      });
  
      // Return the buyer if there are filtered carts for the buyer
      return filteredBuyerCarts.length > 0;
    });
  } 
}