import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { InformationService } from '../services/information.service';
import { CartService } from '../services/cart.service';
import { Product,Buyer,SoldProduct } from '../shared/products';
@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {
  cart: any[];
  userType: string;
  buyerName: string;
  buyerPhoneNumber: string;
  dealerThreshold = 3;
  basePrice!: number;
  totalPrice: number = 0;
  dollarPrice!: any;
  constructor(private productService: ProductsService,
    private informationService: InformationService,
    private cartService: CartService) {
      this.cart = cartService.getCart();
      this.userType = 'user'; // set default user type
      this.buyerName = '';
      this.buyerPhoneNumber = '';
    }

  ngOnInit() {
    this.getTotalPrice();
    console.log(this.cart);
    this.getInformations();
  }
  updateCartItemQuantity(product: any, quantity: number): void {
    this.cartService.updateCartItemQuantity(product, quantity);
    this.cart = this.cartService.getCart();
  }
  getInformations() {
    this.informationService.getDollatPrice().subscribe(
      (dollar) => {
        let index = 'price';
        this.dollarPrice = dollar[index as keyof typeof dollar];
      }
    )
  }

  deleteCartItem(product: any): void {
    this.cartService.deleteCartItem(product);
    this.cart = this.cartService.getCart();
  }

  getTotalPrice(): void {
    for (const item of this.cart) {
      this.basePrice = item.product.userSellingPrice * this.dollarPrice;

      // apply discounts based on user type and purchase quantity
      if (this.userType === 'dealer') {
        if (item.quantity >= this.dealerThreshold) {
          this.basePrice = item.product.deallerSellingPriceAll * this.dollarPrice;
        }else {
          this.basePrice = item.product.deallerSellingPrice * this.dollarPrice;
        }
      }
      this.totalPrice += (this.basePrice * item.quantity);
    }
  }

  

}
