import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-cart-dialog',
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.scss']
})
export class CartDialogComponent {
  cartName!: string;

  constructor(public dialogRef: MatDialogRef<CartDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.cartName);
  }
}
