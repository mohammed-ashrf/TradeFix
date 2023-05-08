import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Receive } from 'src/app/shared/recieve';
import { DeviceService } from '../../device.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
})
export class DeviceListComponent implements OnInit {
  devices: Receive[] = [];
  allDevices: Receive[] = [];
  query = {
    repaired : false,
    paidAdmissionFees : false,
    delivered : false,
    returned : false,
    inProgress : true,
    newDevices: false,
    today: false,
    thisMonth: true,
    thisYear: false,
    specificYear: '',
  }
  constructor(private deviceService: DeviceService, private router: Router) {}

  ngOnInit(): void {
    this.deviceService.getAll().subscribe((devices) => {
      this.devices = devices.reverse();
      this.allDevices = this.devices;
      this.filterDevices();
    });
  }
  filterDevices() {
    this.devices = this.allDevices;
    const filterCriteria = {
      repaired: this.query.repaired,
      paidAdmissionFees: this.query.paidAdmissionFees,
      delivered: this.query.delivered,
      returned: this.query.returned,
      inProgress: this.query.inProgress,
      newDevices: this.query.newDevices,
      today: this.query.today,
      thisMonth: this.query.thisMonth,
      thisYear: this.query.thisYear,
      specificYear: this.query.specificYear,
    };
    const devices = this.deviceService.filterDevices(this.allDevices, filterCriteria);
    this.devices = devices;

  }

}