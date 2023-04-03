import { Component, Input } from '@angular/core';
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
}
