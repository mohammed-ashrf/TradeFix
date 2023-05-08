import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../device/device.service';
import { Location } from '@angular/common';
import { Receive,Query } from '../shared/recieve';

@Component({
  selector: 'app-admin-search',
  templateUrl: './admin-search.component.html',
  styleUrls: ['./admin-search.component.scss']
})
export class AdminSearchComponent implements OnInit {
  searchTerm!: any;
  searchResults!: any[];
  devices!:any[];
  isSearched:boolean = false;
  searchResult!:any[];
  allDevices: Receive[] = [];
  query:Query = {
    repaired : false,
    paidAdmissionFees : false,
    delivered : false,
    returned : false,
    inProgress : false,
    newDevices: false,
    today: false,
    thisMonth: false,
    thisYear: false,
    specificYear: '',
  }

  constructor(private deviceService: DeviceService,
    private location: Location) { }

  ngOnInit() {
    this.deviceService.getAll().subscribe((devices) => {
      this.devices = devices.reverse();
      this.allDevices = this.devices;
      console.log(devices);
    });
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this device?')) {
      this.deviceService.delete(id).subscribe(() => {
        this.devices = this.devices.filter((device) => device._id !== id);
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
  searchDevice(devices: any[], userInput: any) {
    try {
      if (typeof userInput !== 'string') {
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
      window.alert('no device found');
      console.error(error);
      return [];
    }
  }

  search() {
    this.searchResult = this.searchDevice(this.devices, this.searchTerm);
    console.log(this.searchResult);
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
    this.searchResult = devices;
  }
}
