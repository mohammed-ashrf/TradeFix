import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Receive } from 'src/app/shared/recieve';
import { DeviceService } from '../device/device.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
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
export class AdminPageComponent implements OnInit {
  devices: Receive[] = [];

  constructor(private deviceService: DeviceService, private router: Router) {}

  ngOnInit(): void {
    this.deviceService.getAll().subscribe((devices) => {
      this.devices = devices;
    });
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this device?')) {
      this.deviceService.delete(id).subscribe(() => {
        this.devices = this.devices.filter((device) => device._id !== id);
      });
    }
  }
}
