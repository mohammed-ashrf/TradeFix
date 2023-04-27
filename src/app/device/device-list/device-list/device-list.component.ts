import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Receive } from 'src/app/shared/recieve';
import { DeviceService } from '../../device.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
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
export class DeviceListComponent implements OnInit {
  devices: Receive[] = [];

  

  constructor(private deviceService: DeviceService, private router: Router) {}

  ngOnInit(): void {
    this.deviceService.getAll().subscribe((devices) => {
      this.devices = devices;
    });
  }

}


