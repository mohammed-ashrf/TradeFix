import { Injectable } from '@angular/core';
import { Product } from '../shared/products';

export interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  id: number,
  cartName: string;
  buyerName: string;
  phoneNumber: string;
  totalPrice: number;
  paid: number;
  owing: number;
  sellerName: string;
  date: Date;
  products: CartItem[];
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  carts: Cart[] = [];

  constructor() {
    this.loadCartsFromLocalStorage();
  }

  addCart(cartName: string, buyerName: string, phoneNumber: string, sellerName: string, date: Date) {
    const newCart: Cart = {
      id: this.carts.length + 1,
      cartName,
      buyerName,
      phoneNumber,
      totalPrice: 0,
      paid:0,
      owing: 0,
      sellerName,
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
      // existingCartItem.product.quantitySold += quantity; // update the quantity sold of the product
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
      // product.quantitySold += quantity; // update the quantity sold of the product
    }
    cart.totalPrice += price * quantity;
    cart.owing = cart.totalPrice - cart.paid;
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
    cart.owing = cart.totalPrice - cart.paid;
    const product = cartItem.product;
    // product.quantitySold += quantity - oldQuantity; // update the quantity sold of the product
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
    cart.owing = cart.totalPrice - cart.paid;
    const product = deletedProduct.product;
    // product.quantitySold -= deletedProduct.quantity; // subtract the sold quantity from the quantity sold of the product
    this.saveCartsToLocalStorage();
  }

  deleteCart(cartIndex: number) {
    this.carts.splice(cartIndex, 1);
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
    cart.owing = cart.totalPrice - paid;
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
}