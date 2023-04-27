import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../device/device.service';
import { Location } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleInOut', [
      transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate('300ms ease-in-out', style({ transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ transform: 'scale(0)' }))
      ])
    ])
  ]
})
export class SearchComponent implements OnInit {
  searchTerm!: any;
  searchResults!: any[];
  devices!:any[];
  isSearched:boolean = false;
  searchResult!:any[];

  constructor(private deviceService: DeviceService,
    private location: Location) { }

  ngOnInit() {
    this.deviceService.getAll().subscribe((devices) => {
      this.devices = devices;
      console.log(devices);
    });
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
  
}
