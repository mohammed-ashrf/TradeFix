import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Receive,ClientSelection,DeviceType,section } from 'src/app/shared/recieve';
import { DeviceService } from '../../device.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss'],
})
export class DeviceFormComponent implements OnInit {
  receive: Receive = {
    clientName: '',
    telnum: '',
    deviceType: '',
    section: '',
    clientSelection: '',
    complain: '',
    notes: '',
    fees: 0,
    finished: false,
    receivingDate: '',
    _id: '',
  };
  isNew = true;

  prtContent:any;
  // WinPrint:any;

  edited:boolean = false;
  recieptId:any;
  date:any;
  clientSelection = ClientSelection;
  deviceType = DeviceType;
  section = section;

  constructor(
    private deviceService: DeviceService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.deviceService.getOne(id).subscribe((device) => {
        this.receive = device;
      });
    }
    this.date = this.getDate();
  }
  goBack(): void {
    this.location.back();
  }

  getDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  submit(): void {
    if (this.isNew) {
      this.receive.receivingDate = this.getDate();
      this.deviceService.create(this.receive).subscribe((data) => {
        console.log(data._id);
        this.edited = true;
        this.recieptId = data._id;
        window.alert(`Success saving device ${data._id}. You can print now.`);
        // this.router.navigate(['/devices']);
      });
      console.log(this.receive._id);
    } else {
      this.deviceService.update(this.receive._id, this.receive).subscribe(() => {
        this.router.navigate(['/devices']);
      });
    }
  }
}

