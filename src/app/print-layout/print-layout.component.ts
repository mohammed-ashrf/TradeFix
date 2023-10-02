import { Component, Input } from '@angular/core';
import { Cart,CartItem } from '../services/cart.service';
import { Repair } from '../shared/recieve';
@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.scss']
})
export class PrintLayoutComponent {
  @Input()
  clientName!: string;
  @Input()
  telnum!: string;
  @Input()
  deviceType!: string;
  @Input()
  section!: string;
  @Input()
  complain!: string;
  @Input()
  notes!: string;
  @Input()
  receivingDate!: string;
  @Input()
  _id!: string;
  @Input()
  fees!: number;
  @Input()
  deliveringDate!: number;
  @Input()
  isReturned!: boolean;
  @Input()
  repair!: Repair[];
  // invoice
  @Input()
  products!: CartItem[];
  @Input()
  cart!: Cart;
  @Input()
  dollarPrice!: number;
  @Input()
  userType!: string;
}
