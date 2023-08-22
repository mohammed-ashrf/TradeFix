import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../device/device.service';
import { Location } from '@angular/common';
import { Receive, Query } from '../shared/recieve';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchTerm!: any;
  searchResults!: any[];
  devices :Receive[] = [];
  isSearched:boolean = false;
  searchResult!:any[];
  allDevices: Receive[] = [];
  query:Query = {
    repaired: false,
    paidAdmissionFees: false,
    delivered: false,
    returned: false,
    inProgress: false,
    newDevices: false,
    today: false,
    thisMonth: false,
    thisYear: false,
    specificYear: '',
    engineer: '',
    priority: '',
    startDate: '',
    endDate: ''
  }
  users:any;
  user: any;
  constructor(private deviceService: DeviceService,
    private authService: AuthService,
    private location: Location,
    private router: Router) { }

  ngOnInit() {
    localStorage.setItem("location", "search");
    this.user = localStorage.getItem('user');
    console.log(this.user);
    this.deviceService.getAll().subscribe((devices) => {
      this.devices = devices.reverse();
      this.allDevices = this.devices;
      console.log(devices);
    });
    // this.getUsers();
  }

  goBack() {
    var user = JSON.parse(this.user);
    if (user.role === 'receiver') {
      this.router.navigate(['/devices']);
    } else if (user.role === 'technition') {
      this.router.navigate(['/userDashboard']);
    }else {
      this.location.back()
    }
  }
  searchDevice(devices: any[], userInput: any) {
    try {
      if (typeof userInput !== 'string') {
        console.log('User input must be a string');
        throw new Error('User input must be a string');
      }
      userInput = userInput.toLowerCase();
      return devices.filter(device => {
        for (let key in device) {
          if (device.hasOwnProperty(key) && device[key]?.toString().toLowerCase().includes(userInput.toLowerCase())) {
            // this.searchResults.push(device);
            const value = device[key].toString().toLowerCase();
            if (value.includes(userInput)) {
              this.isSearched = true;
              return true;
            }
            break;
          }
        }
        return false;
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  testInput(str: string) {
    return /[A-Za-z0-9\s\S]+/.test(str);
  }

  search() {
      this.searchResult = this.searchDevice(this.devices, this.searchTerm);
      console.log(this.searchResult);
  }
  // resetSearch(){
  //   this.deviceService.getAll().subscribe((devices) => {
  //     this.devices = devices.reverse();
  //     this.allDevices = this.devices;
  //     console.log(devices);
  //   });
  // }
  // getUsers() {
  //   this.authService.getUsers().subscribe(
  //     (users) => {
  //       this.users = users;
  //     }
  //   )
  // }

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
    this.devices = devices;
    this.searchResult = devices;
  }
}
