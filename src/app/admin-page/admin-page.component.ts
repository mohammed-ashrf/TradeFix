import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Receive } from 'src/app/shared/recieve';
import { DeviceService } from '../device/device.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
  devices: Receive[] = [];
  DevicesCount!:number;

  constructor(private deviceService: DeviceService, private router: Router) {}

  ngOnInit(): void {
    this.deviceService.getAll().subscribe((devices) => {
      this.devices = devices;
      this.DevicesCount = devices.length;
    });
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this device?')) {
      this.deviceService.delete(id).subscribe(() => {
        this.devices = this.devices.filter((device) => device._id !== id);
        this.DevicesCount = this.devices.length;
      });
    }
  }
}
