import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Receive,Query } from 'src/app/shared/recieve';
import { DeviceService } from '../device/device.service';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
  devices: Receive[] = [];
  allDevices: Receive[] = [];
  DevicesCount!:number;
  query:Query = {
    repaired : false,
    paidAdmissionFees : false,
    delivered : false,
    returned : false,
    inProgress : true,
    newDevices: false,
    today: false,
    thisMonth: false,
    thisYear: true,
    specificYear: '',
    engineer: '',
    priority: '',
  }
  users:any;
  constructor(private deviceService: DeviceService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.deviceService.getAll().subscribe((devices) => {
      this.devices = devices.reverse();
      this.allDevices = this.devices;
      this.filterDevices();
      this.DevicesCount = devices.length;
    });
    this.getUsers();
  }
  getUsers() {
    this.authService.getUsers().subscribe(
      (users) => {
        this.users = users;
      }
    )
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
      engineer: this.query.engineer,
      priority: this.query.priority,
    };
    const devices = this.deviceService.filterDevices(this.allDevices, filterCriteria);
    this.devices = devices;
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this device?')) {
      this.deviceService.delete(id).subscribe(() => {
        this.devices = this.devices.filter((device) => device._id !== id);
        this.DevicesCount = this.devices.length;
      });
    }
  }
}
