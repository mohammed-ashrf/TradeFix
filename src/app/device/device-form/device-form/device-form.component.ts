import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Receive,ClientSelection,DeviceType,section } from 'src/app/shared/recieve';
import { DeviceService } from '../../device.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
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
    repaired: false,
    paidAdmissionFees: false,
    delivered: false,
    returned: false,
    engineer: '',
    receivingDate: '',
    _id: '',
  };
  print: Receive = {
    clientName: '',
    telnum: '',
    deviceType: '',
    section: '',
    clientSelection: '',
    complain: '',
    notes: '',
    fees: 0,
    finished: false,
    repaired: false,
    paidAdmissionFees: false,
    delivered: false,
    returned: false,
    engineer: '',
    receivingDate: '',
    _id: '',
  }
  submited: boolean = false;
  updating: boolean = false;
  isNew = true;

    
  edited:boolean = false;
  recieptId:any;
  date:any;
  clientSelection = ClientSelection;
  deviceType = DeviceType;
  section = section;
  users:any;

  constructor(
    private deviceService: DeviceService,
    private authService: AuthService,
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
        this.recieptId = device._id.slice(-12);
        this.date = device.receivingDate;
      });
    }
    this.date = this.getDate();
    this.getUsers();
    if (this.isNew) {
      console.log('isNew');
    }else {
      this.updating = true;
    }
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

  determinFees() {
    if (this.receive.section == "laptop" || this.receive.section == "MB") {
      this.receive.fees = 75;
    }else if (this.receive.section == "soft"){
      this.receive.fees = 25;
    }else if (this.receive.section == "cs3"){
      this.receive.fees = 50;
    }else if (this.receive.section == "VGA"){
      this.receive.fees = 40;
    }else if (this.receive.section == "hdd") {
      this.receive.fees = 75;
    }
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.recieptId).then(() => {
      console.log("Receipt ID copied to clipboard");
    }, (error) => {
      console.error("Failed to copy receipt ID to clipboard:", error);
    });
  }
  getUsers() {
    this.authService.getUsers().subscribe(
      (users) => {
        this.users = users;
      }
    )
  }
  submit(form : NgForm): void {
    if (this.isNew) {
      this.receive.receivingDate = this.getDate();
      this.updating = false;
      this.deviceService.create(this.receive).subscribe(
        (data) => {
          this.print = data;
          console.log(data._id);
          console.log(data);
          this.edited = true;
          this.recieptId = data._id.slice(-12);
          window.alert(`Success saving device ${data._id}. You can print now.`);
          navigator.clipboard.writeText(data._id);
          this.copyToClipboard();
          this.submited = true;
          form.resetForm();
        },
        (error) => {
          console.error('Error creating device:', error);
          window.alert('Error creating device. Please try again later.');
        }
      );
      console.log(this.receive._id);
    } else {
      this.deviceService.update(this.receive._id, this.receive).subscribe(
        () => {
          this.router.navigate(['/devices']);
        },
        (error) => {
          console.error('Error updating device:', JSON.stringify(error));
          window.alert(`Error updating device: ${JSON.stringify(error)}. Please try again later.`);
        }
      );
    }
  }
}

