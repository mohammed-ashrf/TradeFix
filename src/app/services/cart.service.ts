import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart';
  
  constructor() { }

  public addToCart(product: any, quantity: number): void {
    let cart = this.getCart();

    const itemIndex = cart.findIndex(item => item.product._id === product._id);

    if (itemIndex >= 0) {
      cart[itemIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    this.saveCart(cart);
  }

  public updateCartItemQuantity(product: any, quantity: number): void {
    let cart = this.getCart();

    const itemIndex = cart.findIndex(item => item.product._id === product._id);

    if (itemIndex >= 0 && quantity > 0) {
      cart[itemIndex].quantity = quantity;
      this.saveCart(cart);
    } else if (itemIndex >= 0 && quantity === 0) {
      cart.splice(itemIndex, 1);
      this.saveCart(cart);
    }
  }
  deleteCartItem(product: any): void {
    let cart = this.getCart();

    const itemIndex = cart.findIndex(item => item.product._id === product._id);

    if (itemIndex >= 0) {
      cart.splice(itemIndex, 1);
      this.saveCart(cart);
    }
  }

  public getCart(): any[] {
    const cart = localStorage.getItem(this.cartKey);

    if (cart) {
      return JSON.parse(cart);
    } else {
      return [];
    }
  }

  private saveCart(cart: any[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }
}
