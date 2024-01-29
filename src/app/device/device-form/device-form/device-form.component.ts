import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Receive,ClientSelection,DeviceType, product, Repair } from 'src/app/shared/recieve';
import { Section,Dealer } from 'src/app/shared/information';
import { Product } from 'src/app/shared/products';
import { ProductsService } from 'src/app/services/products.service';
import { DeviceService } from '../../device.service';
import { InformationService } from 'src/app/services/information.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/auth/user';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/confirmation-modal/confirmation-modal.component';
import { GetdateService } from 'src/app/services/getdate.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/services/notification.service';
import { SafeService } from 'src/app/services/safe.service';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss'],
})
export class DeviceFormComponent implements OnInit {

  product!: product;
  receive: Receive = {
    clientName: '',
    telnum: '',
    deviceType: '',
    section: '',
    clientSelection: 'User',
    complain: '',
    repair: [],
    notes: '',
    fees: 0,
    finished: false,
    repaired: false,
    paidAdmissionFees: false,
    delivered: false,
    returned: false,
    engineer: [],
    priority: '',
    receivingDate: '',
    products: [],
    _id: '',
    cash: 0,
    owing: 0,
    toDeliverDate: '',
    discount: 0,
    total: 0,
    productsMoney: 0,
    repairDate: '',
    reciever: '',
    currentEngineer: ''
  };
  print: Receive = {
    clientName: '',
    telnum: '',
    deviceType: '',
    section: '',
    clientSelection: '',
    complain: '',
    repair: [],
    products: [],
    notes: '',
    fees: 0,
    finished: false,
    repaired: false,
    paidAdmissionFees: false,
    delivered: false,
    returned: false,
    engineer: [],
    priority: 'normal',
    receivingDate: '',
    _id: '',
    cash: 0,
    owing: 0,
    toDeliverDate: '',
    discount: 0,
    total: 0,
    productsMoney: 0,
    repairDate: '',
    reciever: '',
    currentEngineer: ''
  };
  products: Product[] = [];
  submited: boolean = false;
  updating: boolean = false;
  isNew = true;
  initialCash: number = 0;
    
  edited:boolean = false;
  recieptId:any;
  date:any;
  today: any;
  clientSelection = ClientSelection;
  deviceType = DeviceType;
  sections: Section[] = [];
  dealers: Dealer[] = [];
  users:any;
  user!: User;
  id:any;
  token:any;
  disabled = false;
  repairdone = false;
  notBack = true;
  sameEng = false;
  preLocation!: any;
  isSearched: boolean = false;
  searchResult!: Product[];
  searchTerm!: string;
  productPrice: number = 0;
  dollarPrice: number = 1;
  selectedDealer!: Dealer;
  isDealer!: boolean;
  isDevicesRoute: boolean = false;
  currentDate!: string;
  isDealersSearched: boolean = false;
  dealerSearchResult: Dealer[] = [];
  CurrentRepair: string = '';
  constructor(
    private deviceService: DeviceService,
    private productService: ProductsService,
    private informationService: InformationService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
    private dateService: GetdateService,
    private notificationService: NotificationService,
    private SafeService: SafeService,
  ) {}

  ngOnInit(): void {
    this.receive.products = [];
    this.token = localStorage.getItem('token');
    this.preLocation = localStorage.getItem('location');
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      console.log("current user");
      this.user = JSON.parse(currentUser);
      if (this.user.role == 'receiver' || 'admin') {
        this.sameEng = true;
      }
    }    
    this.route.url.subscribe((routes) => {
      // Get the current route
      const currentRoute = routes[0];
      // Check if the current route is the `devices` route
      if (currentRoute.path === 'devices') {
        this.isDevicesRoute = true;
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      if (this.isDevicesRoute) {
        this.deviceService.getOne(id).subscribe((device) => {
          this.receive = device;
          if (isNaN(this.receive.productsMoney)) {
            this.receive.productsMoney = 0;
          }
          this.recieptId = device._id.slice(-7);
          this.date = device.receivingDate;
          this.initialCash = this.receive.cash;
          if(device.clientSelection === 'Dealer'){
            this.selectedDealer.name = device.clientName;
          };
          if (this.user.role == 'technition') {
            this.disabled = true;
            if (this.receive.repaired) {
              this.repairdone = true;
            }
            if (this.user._id == this.receive.currentEngineer){
              this.sameEng = true;
            }
          }
          for(let i=0; i< device.engineer.length; i++) {
            this.authService.getUserById(device.engineer[i].toString()).subscribe(
              (user) => {
                let eng = {
                  name: user.username,
                  _id: user._id,
                }
                this.receive.engineer[i] = eng;
              }
            )
          };
        });
      }else {
        this.deviceService.getOneDeliveredDevice(id).subscribe((device) => {
          this.receive = device;
          if (isNaN(this.receive.productsMoney)) {
            this.receive.productsMoney = 0;
          }
          this.recieptId = device._id.slice(-7);
          this.date = device.receivingDate;
          this.initialCash = this.receive.cash;
          if(device.clientSelection === 'Dealer'){
            this.selectedDealer.name = device.clientName;
          }
          if (this.user.role == 'technition') {
            console.log(this.user.username);
            console.log(this.receive.engineer);
            this.disabled = true;
            if (this.receive.repaired) {
              this.repairdone = true;
            }
            if (this.user._id == this.receive.currentEngineer){
              this.sameEng = true;
            }
          }
          for(let i=0; i< device.engineer.length; i++) {
            this.authService.getUserById(device.engineer[i].toString()).subscribe(
              (user) => {
                let eng = {
                  name: user.username,
                  _id: user._id,
                }
                this.receive.engineer[i] = eng;
              }
            )
          };
        });
      }
    }

    this.getInformations();
    this.getUsers();
    this.getDate();

    
    if (this.isNew) {
      console.log('isNew');
    }else {
      this.updating = true;
    };
    this.productService.getAll().subscribe(
      (products) => {
        this.products = products;
      }
    );
  }


  addMoneyToSafe(amount: number) {
    this.SafeService.addMoney(amount, this.today, 'repair',  `${this.user.username}, (${this.user._id})`).subscribe(
      (res) => {
        console.log('add money to safe');
      }
    )
  };

  deductMoneyFromSafe(amount: number) {
    this.SafeService.deductMoney(amount, this.today, 'repair',  `${this.user.username}, (${this.user._id})`).subscribe(
      (res) => {
        console.log('deduct money from safe');
      }
    )
  };


  getInformations() {
    this.informationService.getSections().subscribe(
      (sections) => {
        this.sections = sections;
      }
    );
    this.informationService.getDealers().subscribe(
      (dealers) => {
        this.dealers = dealers;
      }
    );
    this.informationService.getDollatPrice().subscribe(
      (dollar) => {
        let index = 'price';
        this.dollarPrice = dollar[index as keyof typeof dollar];
        console.log(this.dollarPrice);
      }
    );
  }

  getUsers() {
    this.authService.getUsers().subscribe(
      (users) => {
        this.users = users;
      }
    )
  }

  updateTelnum(dealer: Dealer) {
    console.log(dealer);
    if (this.receive.clientSelection === 'Dealer') {
      this.receive.telnum = dealer.phone;
    } else {
      this.receive.telnum = '';
    }
  }

  searchProducts(products: any[], userInput: string) {
    try {
      if (typeof userInput !== 'string') {
        console.log('User input must be a string');
        throw new Error('User input must be a string');
      }
      userInput = userInput.toLowerCase();
      return products.filter(product => {
        return product.name.toLowerCase().includes(userInput);
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  testInput(str: string) {
    return /[A-Za-z0-9\s\S]+/.test(str);
  }

  onSearch() {
      this.searchResult = this.searchProducts(this.products, this.searchTerm);
      console.log(this.searchResult);
      this.isSearched = true;
  }
  searchDealers() {
    this.dealerSearchResult = this.searchProducts(this.dealers, this.receive.clientName);
    this.isDealersSearched = true;
  }

  onSelectDealer(item: Dealer) {
    this.receive.clientName = item.name;
    this.receive.telnum = item.phone;
    this.isDealersSearched = false;
  }

  onSelect(item: Product, quantity:number) {
    if(item.quantity <= 0) {
      throw new Error(`Not enough stock for ${item.name}. Available stock: ${item.quantity}`);
    }else {
      this.productPrice = this.receive.clientSelection == 'User' ? item.userSellingPrice * this.dollarPrice : item.deallerSellingPrice * this.dollarPrice;
      this.product = {
        productId: item._id,
        productName: item.name,
        purchasePrice: (item.suppliers[item.suppliers.length -1].purchasePrice * this.dollarPrice),
        productPrice: this.productPrice,
        quantity: quantity,        
      }
      this.receive['products'].push(this.product);
      item.quantity -= quantity;
      this.productService.update(item._id, item);
      console.log(this.product);
      this.receive.productsMoney += this.productPrice;
      this.product = { productId: '', productName: '', purchasePrice: 0,productPrice: 0, quantity: 0};
      this.searchTerm = '';
      this.isSearched = false;
    }
  }

  onDelete(key: string) {
    this.receive['products'].forEach((product,index)=>{
        if(product.productId == key) {
          this.receive['products'].splice(index,1);
          this.receive.productsMoney -= product.productPrice;
          this.productService.getOne(product.productId).subscribe(
            (item) => {
              item.quantity += product.quantity;
              this.productService.update(item._id, item);
            }
          )
        }
    });
  }

  addRepair(){
    let repair: Repair = {
      value: this.CurrentRepair,
      engineer: `${this.user.username}`,
      date: new Date(),
    }
    this.receive.repair.push(repair);
    this.CurrentRepair = '';
  }

  addEng(id: string){
    this.authService.getUserById(id).subscribe(
      (eng) => {
        let engineer = {
          name: eng.username,
          _id: eng._id
        }
        this.receive.engineer.push(engineer);
      }
    )
  }


  goBack(deviceForm: NgForm): void {
    this.notBack = false;
    if (this.submited) {
      this.router.navigate([`/${this.preLocation}`]);
    } else {
      if (deviceForm.valid) {
        this.showConfirmationModal().then(result => {
          if (result) {
            this.submit(deviceForm);
          }
          this.router.navigate([`/${this.preLocation}`]);
        });
      } else {
        this.router.navigate([`/${this.preLocation}`]);
      }
    }
  }

  async showConfirmationModal(): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
    });

    return dialogRef.afterClosed().toPromise().then((result: boolean) => {
      return result || false;
    });
  }

  getDate() {
    this.dateService.getCurrentDate()
      .then(async (date) => {
        await this.CheckDate(date);
      })
      .catch(error => {
        console.error('Error retrieving current date:', error);
      });
  }

  CheckDate(date: string) {
    this.deviceService.getLastDevice().subscribe(
      (lastDevice) => {
        const lastDeviceDate = new Date(lastDevice.receivingDate);
        const currentDate = new Date(date);
        if (currentDate >= lastDeviceDate) {
          this.currentDate = date;
          this.today = date;
          if(this.isNew) {
            this.date = date;
          }
        }else {
          window.alert("Your date is not right, fix it or connect to the internet");
        }
      }
    )
  }

  determinFees() {
    let selectedSection = this.sections.find((i: Section) => i.name === this.receive.section);
    if (selectedSection) {
      this.receive.fees = selectedSection.checkingFees;
    };
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.recieptId).then(() => {
      console.log("Receipt ID copied to clipboard");
    }, (error) => {
      console.error("Failed to copy receipt ID to clipboard:", error);
    });
  }

  repairStatus() {
    // this.whichUser();
    if (this.user.role == 'technition') {
      this.disabled = true;
      if (this.receive.repaired) {
        this.repairdone = true;
        if(this.today){
          this.receive.repairDate = this.today;
        }else {
          this.receive.repairDate = new Date().toString();
        }
      }
    }else {
      if(this.today){
        this.receive.repairDate = this.today;
      }else {
        this.receive.repairDate = new Date().toString();
      }
    }

  }

  moveToDelivered(deviceId: string): void {
    this.deviceService.moveDeviceToDelivered(deviceId).subscribe(
      () => {
        // Success: Device moved to delivered devices
        console.log('delivered');
        if (this.notBack){
          this.location.back();
         }
      },
      (error) => {
        // Error handling
        console.log(error);
      }
    );
  }

  updateDeliveredDevice(deviceId: string, updates: any): void {
    this.deviceService.updateDeliveredDevice(deviceId, updates).subscribe(
      (updatedDevice) => {
        if (updatedDevice.cash > this.initialCash) {
          let cash = updatedDevice.cash - this.initialCash;
          this.addMoneyToSafe(cash);
        }else if (this.initialCash > updatedDevice.cash) {
          let cash = this.initialCash - updatedDevice.cash;
          this.deductMoneyFromSafe(cash);
        };
        console.log(updatedDevice);
      },
      (error) => {
        // Error handling
        console.log(error);
      }
    );
  }

  returnDeliveredToDevices(deviceId: string): void {
    this.deviceService.returnDeviceToDevices(deviceId).subscribe(
      () => {
        // Success: Device returned to devices
        this.router.navigate(['/devices', deviceId , 'edit']);
        console.log('returned');
      },
      (error) => {
        // Error handling
        console.log(error);
      }
    );
  }
  submit(form : NgForm): void {
    this.receive.total = (this.receive.fees + this.receive.productsMoney) - this.receive.discount;
    this.receive.owing = this.receive.total - this.receive.cash;
    if (this.isNew) {
      this.receive.receivingDate = this.currentDate;
      this.updating = false;
      this.receive.reciever = this.user.username;
      this.deviceService.create(this.receive).subscribe(
        (data) => {
          this.print = data;
          this.edited = true;
          this.recieptId = data._id.slice(-12);
          if (data.cash !== 0){
            this.addMoneyToSafe(data.cash);
          }
          window.alert(`Success saving device ${data._id}. You can print now.`);
          navigator.clipboard.writeText(data._id);
          this.copyToClipboard();
          this.submited = true;
          this.isNew = false;
          if (this.notBack){
            form.resetForm();
          }
          this.receive = {
            clientName: '',
            telnum: '',
            deviceType: '',
            section: '',
            clientSelection: 'User',
            complain: '',
            repair: [],
            notes: '',
            fees: 0,
            finished: false,
            repaired: false,
            paidAdmissionFees: false,
            delivered: false,
            returned: false,
            engineer: [],
            priority: '',
            receivingDate: '',
            products: [],
            _id: '',
            cash: 0,
            owing: 0,
            toDeliverDate: '',
            discount: 0,
            total: 0,
            productsMoney: 0,
            repairDate: '',
            reciever: '',
            currentEngineer: '',
          };
        },
        (error) => {
          console.error('Error creating device:', error);
          window.alert('Error creating device. Please try again later.');
        }
      );
      console.log(this.receive._id);
    } else {
      this.deviceService.update(this.receive._id, this.receive).subscribe(
        (device) => {
          // this.submited = true;
          if (device.cash > this.initialCash) {
            let cash = device.cash - this.initialCash;
            this.addMoneyToSafe(cash);
          }else if (this.initialCash > device.cash) {
            let cash = this.initialCash - device.cash;
            this.deductMoneyFromSafe(cash);
          };
          if (this.user.role == "technition") {
            const notification: Notification = {
              _id: '',
              title: "Device Update",
              message: `${this.user.username} updated ${device._id}`,
              timestamp: new Date(this.currentDate),
              type: 'device',
              id: `${device._id}`,
            }
            this.notificationService.createNotification(notification).subscribe(
              () => {
                console.log('Sent Notification');
              }
            )
          }
          console.log("updated");
          window.alert('device is updated');
        },
        (error) => {
          console.error('Error updating device:', JSON.stringify(error));
          window.alert(`Error updating device: ${JSON.stringify(error)}. Please try again later.`);
        }
      );
    }
  }
}

