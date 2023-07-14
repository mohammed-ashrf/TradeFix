import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { InformationService } from '../services/information.service';
import { CartService, Cart, CartItem } from '../services/cart.service';
import { Product } from '../shared/products';
// import { Cart, CartItem } from '../services/cart.service';

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
  userType: string = 'user';
  dollarPrice: number = 1; // default value, can be changed according to currency conversion rate
  cart:any;
  cartId!: number;
  products: any;
  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.carts = this.cartService.getCarts();
    this.currentCart = this.carts[0];
    this.products = this.currentCart.products;
    this.buyerName = this.currentCart.buyerName;
    this.buyerPhoneNumber = this.currentCart.phoneNumber;
    console.log(this.currentCart);
    this.getTotalPrice();
  }

  createNewCart() {
    const cartName = prompt('Enter cart name:');
    if (cartName) {
      this.cartService.addCart(cartName, this.buyerName, this.buyerPhoneNumber, '', new Date());
      this.carts = this.cartService.getCarts();
      const cart = this.carts.find(cart => (cart: { cartName: string; }) => cart.cartName === cartName);
      if (cart) {
        this.currentCart = cart;
      }
      this.getTotalPrice();
    }
  }

  onCartChange(cartId: number) {
    console.log('changed' + cartId)
    const cart = this.cartService.getCart(cartId);
    if (cart) {
      this.currentCart = cart;
      this.products = cart.products;
      this.buyerName = cart.buyerName;
      this.buyerPhoneNumber = this.currentCart.phoneNumber;
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
  }

  updateCartInformation() {
    this.currentCart.buyerName = this.buyerName;
    this.currentCart.phoneNumber = this.buyerPhoneNumber;
    this.cartService.updateCart(this.currentCart.id - 1, this.currentCart);
    this.getTotalPrice();
  }

  getTotalPrice() {
    let total = 0;
    for (const item of this.currentCart.products) {
      let price = this.userType === 'user' ? item.product.userSellingPrice : item.quantity >= 3 ? item.product.deallerSellingPriceAll : item.product.deallerSellingPrice;
      total += price * item.quantity;
    }
    this.totalPrice = total * this.dollarPrice;
  }
}