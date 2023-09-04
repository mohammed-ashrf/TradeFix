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
  filteredDevicesCount !: number;
  allFileterdDevices: Receive[] = [];
  query:Query = {
    repaired: true,
    paidAdmissionFees: false,
    delivered: false,
    returned: false,
    inProgress: false,
    newDevices: false,
    today: false,
    thisMonth: true,
    thisYear: false,
    specificYear: '',
    engineer: '',
    priority: '',
    startDate: '',
    endDate: ''
  }
  users:any;
  page: number = 0;
  itemToload: number = 0;
  currentUser: string | null;
  user: any;
  constructor(private deviceService: DeviceService, private router: Router, private authService: AuthService) {
    this.currentUser = localStorage.getItem('user');
      if (this.currentUser) {
        this.user = JSON.parse(this.currentUser);
      }
  }

  ngOnInit(): void {
    localStorage.setItem("location", "admin");
    this.getAllDevices();
    this.getUsers();
    const cardsContainer =  document.getElementById('cards-container');
    if (cardsContainer) {
      cardsContainer.addEventListener('scroll', event => {
        const { scrollHeight, scrollTop, clientHeight } = (event.target as Element);

        if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
            console.log('scrolled');
            if (this.allFileterdDevices.length > this.devices.length) {
              this.itemToload += 10;
              this.devices = this.allFileterdDevices.slice(0, this.itemToload);
              console.log(' scrolling loaded');
            }
        }
      });
    }

  }
  getUsers() {
    this.authService.getUsers().subscribe(
      (users) => {
        this.users = users;
      }
    )
  }

  getDevicesByPage() {
    this.deviceService.getDevicesByPage(this.page).subscribe((devices) => {
      this.devices = devices.reverse();
      this.allDevices = this.devices;
      this.filterDevices();
    });
  }

  getAllDevices() {
    this.deviceService.getAll().subscribe(async (devices) => {
      console.log(devices);
      this.devices = devices.reverse();
      this.allDevices = this.devices;
      await this.filterDevices();
      this.DevicesCount = this.allDevices.length;
    });
  }

  loadDevices() {
      this.itemToload = 10;
      this.devices = this.allFileterdDevices.slice(0, this.itemToload);
      console.log('esleLoaded');
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
      startDate: this.query.startDate,
      endDate: this.query.endDate
    };
    const devices = this.deviceService.filterDevices(this.allDevices, filterCriteria);
    this.filteredDevicesCount = devices.length;
    this.allFileterdDevices = devices;
    this.loadDevices();
  }

  resetFilter():void {
    this.query = {
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
      engineer: '',
      priority: '',
      startDate: '',
      endDate: ''
    }

    this.filterDevices();
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this device?')) {
      this.deviceService.delete(id).subscribe(() => {
        this.allFileterdDevices = this.allFileterdDevices.filter((device) => device._id !== id);
        this.loadDevices();
        this.DevicesCount -= 1;
        this.filteredDevicesCount -= 1;
      });
    }
  }

  isPriorityHigh(priority: string): boolean {
    return priority === 'high';
  }
}
