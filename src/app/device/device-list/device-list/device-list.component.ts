import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Receive, Query } from 'src/app/shared/recieve';
import { DeviceService } from '../../device.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User,GUser } from 'src/app/auth/user';
@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
})
export class DeviceListComponent implements OnInit {
  devices: Receive[] = [];
  allFileterdDevices: Receive[] = [];
  allDevices: Receive[] = [];
  query: Query = {
    repaired: false,
    paidAdmissionFees: false,
    delivered: false,
    returned: false,
    inProgress: true,
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
  currentUser: any;
  user!: User;
  id:any;
  username:any;
  token:any;
  page: number = 0;
  itemToload: number = 0;
  constructor(private deviceService: DeviceService,
    private authService: AuthService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    localStorage.setItem("location", "devices");
    this.currentUser = localStorage.getItem('user'); 
    if (this.currentUser) {
      this.user = JSON.parse(this.currentUser);
      this.getAllDevices();
      this.getUsers()
      this.loadOnScroll();
    }
  }

  getUsers() {
    this.authService.getUsers().subscribe(
      (users) => {
        this.users = users;
      }
    )
  }

  loadOnScroll() {
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
      engineer: this.query.engineer,
      priority: this.query.priority,
      newDevices: this.query.newDevices,
      today: this.query.today,
      thisMonth: this.query.thisMonth,
      thisYear: this.query.thisYear,
      specificYear: this.query.specificYear,
      startDate: this.query.startDate,
      endDate: this.query.endDate
    };
    const devices = this.deviceService.filterDevices(this.allDevices, filterCriteria);
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


  isPriorityHigh(priority: string): boolean {
    return priority === 'high';
  }

}