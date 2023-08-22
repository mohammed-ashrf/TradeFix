import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Output() result: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<ConfirmationModalComponent>) {}

  confirm(): void {
    this.result.emit(true);
    this.dialogRef.close();
  }
}
