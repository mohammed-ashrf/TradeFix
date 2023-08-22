import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Receive,ClientSelection,DeviceType, product } from 'src/app/shared/recieve';
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
    products: [],
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
    products: [],
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
  };
  products: Product[] = [];
  submited: boolean = false;
  updating: boolean = false;
  isNew = true;

    
  edited:boolean = false;
  recieptId:any;
  date:any;
  today: any;
  clientSelection = ClientSelection;
  deviceType = DeviceType;
  sections: Section[] = [];
  dealers: Dealer[] = [];
  users:any;
  currentUser: any;
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
  constructor(
    private deviceService: DeviceService,
    private productService: ProductsService,
    private informationService: InformationService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.receive.products = [];
    this.token = localStorage.getItem('token');
    this.preLocation = localStorage.getItem('location');
    this.currentUser = localStorage.getItem('user');
    if (this.currentUser) {
      console.log("current user");
      this.user = JSON.parse(this.currentUser);
      if (this.user.role == 'receiver') {
        this.sameEng = true;
      }else if (this.user.role == 'admin') {
        this.sameEng = true;
      };
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.deviceService.getOne(id).subscribe((device) => {
        this.receive = device;
        this.recieptId = device._id.slice(-7);
        this.date = device.receivingDate;
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
          if (this.user.username == this.receive.engineer){
            this.sameEng = true;
          }
        }
      });
    }

    this.getInformations();
    this.date = this.getDate();
    this.today = this.getDate();
    this.getUsers();
    
    if (this.isNew) {
      console.log('isNew');
    }else {
      this.updating = true;
    };
    this.productService.getAll().subscribe(
      (products) => {
        this.products = products;
        console.log(this.products);
      }
    );
  }

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
// this need to be fixed
  onSelect(item: Product, quantity:number) {
    if(item.quantity <= 0) {
      throw new Error(`Not enough stock for ${item.name}. Available stock: ${item.quantity}`);
    }else {
      this.product = {
        productId: item._id,
        productName: item.name,
        productPrice: this.productPrice,
        quantity: quantity,        
      }
      this.receive['products'].push(this.product);
      item.quantity -= quantity;
      this.productService.update(item._id, item);
      console.log(this.product);
      this.receive.fees += item.userSellingPrice;
      this.product = { productId: '', productName: '', productPrice: 0, quantity: 0};
      this.searchTerm = '';
      this.isSearched = false;
    }
  }

  onDelete(key: string) {
    this.receive['products'].forEach((product,index)=>{
        if(product.productId == key) {
          this.receive['products'].splice(index,1);
          this.receive.fees -= (product.productPrice * this.dollarPrice);
          this.productService.getOne(product.productId).subscribe(
            (item) => {
              item.quantity += product.quantity;
              this.productService.update(item._id, item);
            }
          )
        }
    });
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
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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

