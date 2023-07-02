import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Receive,ClientSelection,DeviceType,section } from 'src/app/shared/recieve';
import { DeviceService } from '../../device.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/auth/user';
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
    repair: '',
    notes: '',
    fees: 0,
    finished: false,
    repaired: false,
    paidAdmissionFees: false,
    delivered: false,
    returned: false,
    engineer: '',
    priority: '',
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
    repair: '',
    notes: '',
    fees: 0,
    finished: false,
    repaired: false,
    paidAdmissionFees: false,
    delivered: false,
    returned: false,
    engineer: '',
    priority: 'normal',
    receivingDate: '',
    _id: '',
  }
  submited: boolean = false;
  updating: boolean = false;
  isNew = true;

    
  edited:boolean = false;
  recieptId:any;
  date:any;
  today: any;
  clientSelection = ClientSelection;
  deviceType = DeviceType;
  section = section;
  users:any;
  currentUser: any;
  user!: User;
  id:any;
  username:any;
  token:any;
  role:any;
  disabled = false;
  repairdone = false;
  notBack = true;
  sameEng = false;
  preLocation!: any;
  constructor(
    private deviceService: DeviceService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.preLocation = localStorage.getItem('location'); 
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.deviceService.getOne(id).subscribe((device) => {
        this.receive = device;
        this.recieptId = device._id.slice(-7);
        this.date = device.receivingDate;
      });
    }
    this.date = this.getDate();
    this.today = this.getDate();
    this.getUsers();
    if (this.isNew) {
      console.log('isNew');
    }else {
      this.updating = true;
    }
  }

  goBack(deviceForm: NgForm): void {
    this.notBack = false;
    if (this.submited){
      this.router.navigate([`/${this.preLocation}`]);
      // this.location.back();
    }else {
      if(deviceForm.valid) {
        if (confirm('Do you want to save?')) {
          this.submit(deviceForm);
          this.router.navigate([`/${this.preLocation}`]);
          // this.location.back();
        }else {
          this.router.navigate([`/${this.preLocation}`]);
          // this.location.back();
        }
      }else {
        this.router.navigate([`/${this.preLocation}`]);
        // this.location.back();
      }
    }
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
    }else if (this.receive.section == "Monitor"){
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
              this.role = this.user.role;
              console.log(this.role);
              if (this.role == 'technition') {
                this.disabled = true;
                if (this.receive.repaired) {
                  this.repairdone = true;
                }
                if (this.username == this.receive.engineer){
                  this.sameEng = true;
                }
              }else if (this.role == 'receiver') {
                this.sameEng = true;
              }else {
                this.sameEng = true;
              }
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

  repairStatus() {
    // this.whichUser();
    if (this.role == 'technition') {
      this.disabled = true;
      if (this.receive.repaired) {
        this.repairdone = true;
      }
    }
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
          if (this.notBack){
            form.resetForm();
          }
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
          // this.submited = true;
          if (this.notBack){
           this.location.back();
          }
        },
        (error) => {
          console.error('Error updating device:', JSON.stringify(error));
          window.alert(`Error updating device: ${JSON.stringify(error)}. Please try again later.`);
        }
      );
    }
  }
}

