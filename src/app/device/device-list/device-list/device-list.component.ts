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
  }
  users:any;
  currentUser: any;
  user!: User;
  id:any;
  username:any;
  token:any;
  constructor(private deviceService: DeviceService,
    private authService: AuthService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.deviceService.getAll().subscribe((devices) => {
      this.devices = devices.reverse();
      this.allDevices = this.devices;
      this.filterDevices();
    });
    this.getUsers();
  }

  getUsers() {
    this.authService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.whichUser();
      }
    )
  }

  whichUser() {
    this.authService.getUser(this.token).subscribe(
      (userInfo) => {
        this.currentUser = userInfo;
        if (this.currentUser.user) {
          this.id = this.currentUser.user.id;
          
          for (let i = 0; i < this.users.length; i++) {
            if (this.users[i]._id === this.id) {
              this.user = this.users[i];
              this.username = this.user.username;
              break;
            }
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  };


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
      engineer: '',
      priority: '',
    }

    this.filterDevices();
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }

  isPriorityHigh(priority: string): boolean {
    return priority === 'high';
  }

}