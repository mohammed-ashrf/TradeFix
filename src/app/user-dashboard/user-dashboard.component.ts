import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Receive, Query } from 'src/app/shared/recieve';
import { DeviceService } from '../device/device.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  devices: Receive[] = [];
  allDevices: Receive[] = [];
  query: Query = {
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
  };
  users: any;
  currentUser: any;
  user!: User;
  id: any;
  username: any;
  token: any;
  inProgressCount: number = 0;
  completedCount: number = 0;
  returnedCount: number = 0;

  constructor(
    private deviceService: DeviceService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.token = localStorage.getItem('token');
    try {
      const userInfo = await firstValueFrom(this.authService.getUser(this.token));
      this.currentUser = userInfo;
      if (this.currentUser.user) {
        this.id = this.currentUser.user.id;
        const users = await firstValueFrom(this.authService.getUsers());
        this.users = users;
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i]._id === this.id) {
            this.user = this.users[i];
            this.username = this.user.username;
            break;
          }
        }
        const devices = await firstValueFrom(this.deviceService.getAll());
        this.allDevices = Object.assign([], devices.reverse());
        this.filterDevices();
        this.countDevices();
      }
    } catch (error) {
      console.log(error);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  filterDevices() {
    const filterCriteria = {
      repaired: this.query.repaired,
      paidAdmissionFees: this.query.paidAdmissionFees,
      delivered: this.query.delivered,
      returned: this.query.returned,
      inProgress: this.query.inProgress,
      engineer: this.username,
      priority: this.query.priority,
      newDevices: this.query.newDevices,
      today: this.query.today,
      thisMonth: this.query.thisMonth,
      thisYear: this.query.thisYear,
      specificYear: this.query.specificYear,
    };
    const devices = this.deviceService.filterDevices(this.allDevices, filterCriteria);
    this.devices = devices;
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
      engineer: this.username,
      priority: '',
    }

    this.filterDevices();
  }

  countDevices() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    this.devices.forEach((device) => {
      const date = new Date(device.receivingDate);
      const month = date.getMonth();
      if (month === currentMonth) {
        if (device.repaired && device.delivered) {
          this.completedCount++;
        } else if (device.returned) {
          this.returnedCount++;
        } else {
          this.inProgressCount++;
        }
      }
    });
  }

  isPriorityHigh(priority: string): boolean {
    return priority === 'high';
  }
}