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
  allFilteredDevices: Receive[] =[];
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
    thisMonth: true,
    thisYear: false,
    specificYear: '',
    engineer: '',
    priority: '',
    startDate: '',
    endDate: ''
  }
  users:any;
  user: any;
  currentUser!: any;
  searchProperty: string = 'clientName';
  itemToload: number = 0;
  searchingFor: string = 'devices';
  constructor(private deviceService: DeviceService,
    private authService: AuthService,
    private location: Location,
    private router: Router) { }

  ngOnInit() {
    localStorage.setItem("location", "search");
    this.user = localStorage.getItem('user');
    if (this.user) {
      this.currentUser = JSON.parse(this.user);
    }
    this.getAllDevices();
    this.getUsers();
    this.loadDevicessOnScroll();
  }
  loadDevicessOnScroll() {
    const cardsContainer =  document.getElementById('table-container');
    if (cardsContainer) {
      cardsContainer.addEventListener('scroll', event => {
        const { scrollHeight, scrollTop, clientHeight } = (event.target as Element);

        if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
            console.log('scrolled');
            if (this.allFilteredDevices.length > this.searchResult.length) {
              this.itemToload += 10;
              this.searchResult = this.allFilteredDevices.slice(0, this.itemToload);
              console.log(' scrolling loaded');
            }
        }
      });
    }
  }

  onChange() {
    this.isSearched = false;
    if(this.searchingFor === "devices") {
      this.getAllDevices();
    }else if (this.searchingFor === "delivered") {
      this.getDeliveredDevies();
    }
  }

  getAllDevices() {
    this.deviceService.getAll().subscribe((devices) => {
      this.devices = devices.reverse();
      this.allDevices = this.devices;
      console.log(devices);
    });
  }

  getDeliveredDevies(){
    this.deviceService.getAllDeliveredDevices().subscribe((devices) => {
      this.devices = devices.reverse();
      this.allDevices = this.devices;
      console.log(devices);
    });
  }

  goBack() {
    var user = JSON.parse(this.user);
    if (user.role === 'receiver') {
      this.router.navigate(['/devices']);
    } else if (user.role === 'technition') {
      this.router.navigate(['/userDashboard']);
    }else if (user.role === 'admin') {
      this.router.navigate(['/admin']);
    }
  }


  searchDevice(devices:  any[], userInput: any, searchProperty: string) {
    try {
      if (typeof userInput !== 'string') {
        console.log('User input must be a string');
        throw new Error('User input must be a string');
      }
      userInput = userInput.toLowerCase();
      return devices.filter(device => {
        if (device.hasOwnProperty(searchProperty) && device[searchProperty]?.toString().toLowerCase().includes(userInput)) {
          this.isSearched = true;
          return true;
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
  loadDevices() {
    this.itemToload = 10;
    this.searchResult = this.allFilteredDevices.slice(0, this.itemToload);
    console.log('esleLoaded');
  }

  search() {
    this.searchResult = this.searchDevice(this.devices, this.searchTerm, this.searchProperty);
    console.log(this.searchResult.length);
    this.allFilteredDevices = this.searchResult;
    this.loadDevices();
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
    const base = {
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
    };
    if(this.currentUser.role == 'technition') {
      filterCriteria.engineer = this.currentUser.username;
      base.engineer = this.currentUser.username;
    }
    if(filterCriteria ===  base) {
      this.devices = this.allDevices;
    }
    else {
      const devices = this.deviceService.filterDevices(this.allDevices, filterCriteria);
      this.devices = devices;
      this.searchResult = devices;
    }
  }

  getUsers() {
    this.authService.getUsers().subscribe(
      (users) => {
        this.users = users;
      }
    )
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this device?')) {
      this.deviceService.delete(id).subscribe(() => {
        this.devices = this.devices.filter((device) => device._id !== id);
      });
    }
  }

  deleteDeliveredDevice(deviceId: string): void {
    this.deviceService.deleteDeliveredDevice(deviceId).subscribe(
      () => {
        // Success: Delivered device deleted
        console.log('delivered deleted');
      },
      (error) => {
        // Error handling
        console.log(error);
      }
    );
  }
}
