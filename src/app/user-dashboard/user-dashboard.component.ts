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
    repaired: false,
    paidAdmissionFees: false,
    delivered: false,
    returned: false,
    inProgress: true,
    newDevices: false,
    today: false,
    thisMonth: false,
    thisYear: false,
    specificYear: '',
    engineer: '',
    priority: '',
    startDate: '',
    endDate: ''
  };
  users: any;
  user!: User;
  id: any;
  username: any;
  token: any;
  inProgressCount: number = 0;
  completedCount: number = 0;
  returnedCount: number = 0;
  returnedInTheSameMonth: number = 0;

  constructor(
    private deviceService: DeviceService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.token = localStorage.getItem('token');
    localStorage.setItem("location", "userDashboard");
    const currentUser = localStorage.getItem('user'); 
    if (currentUser) {
      this.user = JSON.parse(currentUser);
      this.username = this.user.username;
      const devices = await firstValueFrom(this.deviceService.getAll());
      this.allDevices = Object.assign([], devices.reverse());
      this.filterDevices();
      this.countDevices();
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
      engineer: this.user._id,
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
      thisMonth: false,
      thisYear: false,
      specificYear: '',
      engineer: this.user._id,
      priority: '',
      startDate: '',
      endDate: ''
    }

    this.filterDevices();
  }

  countDevices() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    this.allDevices.forEach((device) => {
      const date = new Date(device.receivingDate);
      const month = date.getMonth();
      if (Array.isArray(device.engineer)) {
        device.engineer.forEach((eng)=> {
          if(eng === this.user._id){
            if (month === currentMonth) {
              if (device.repaired) {
                this.completedCount++;
              }else if (device.returned) {
                this.returnedInTheSameMonth++;
              }
            }
            if (!device.repaired) {
              this.inProgressCount++;
            }
            if (device.returned) {
              this.returnedCount++;
            }
          }
        });
      }
    });
  }

  isPriorityHigh(priority: string): boolean {
    return priority === 'high';
  }
}