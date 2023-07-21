import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientSelection,DeviceType} from 'src/app/shared/recieve';
import { Product } from '../shared/products';
import { ProductsService } from '../services/products.service';
import { InformationService } from '../services/information.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/auth/user';
@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit{
  // buyer!: Buyer;
  product: Product = {
    name: '',
    description: '',
    purchasePrice: 0,
    deallerSellingPrice: 0,
    deallerSellingPriceAll: 0,
    userSellingPrice: 0,
    category: '',
    quantity: 0,
    purchasedate: '',
    sellingdate: '',
    _id: '',
    supplier: '',
    whatIsPaid: 0,
    oweing: 0,
    quantitySold: 0,
    // buyers: [this.buyer],
  };
  print: Product = {
    name: '',
    description: '',
    purchasePrice: 0,
    deallerSellingPrice: 0,
    deallerSellingPriceAll: 0,
    userSellingPrice: 0,
    category: '',
    quantity: 0,
    purchasedate: '',
    sellingdate: '',
    _id: '',
    supplier: '',
    whatIsPaid: 0,
    oweing: 0,
    quantitySold:0,
    // buyers: [this.buyer],
  };
  submited: boolean = false;
  updating: boolean = false;
  isNew = true;

  allSuppliers:any;
  sections: any;
  edited:boolean = false;
  recieptId:any;
  date:any;
  today: any;
  clientSelection = ClientSelection;
  deviceType = DeviceType;
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
    private productsService: ProductsService,
    private informationService: InformationService,
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
      this.productsService.getOne(id).subscribe((product) => {
        this.product = product;
        this.recieptId = product._id.slice(-7);
        this.date = product.purchasedate;
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
    }
  }

  determineOweing() {
    this.product.oweing = (this.product.quantity * this.product.purchasePrice) - this.product.whatIsPaid;
  }

  getInformations(){
    this.informationService.getSuppliers().subscribe(
      (suppliers) => {
        this.allSuppliers = suppliers;
      }
    );
    this.informationService.getSections().subscribe(
      (sections) => {
        this.sections = sections;
      }
    )
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

  // determinFees() {
  //   if (this.product.section == "laptop" || this.product.section == "MB") {
  //     this.product.fees = 75;
  //   }else if (this.product.section == "soft"){
  //     this.product.fees = 25;
  //   }else if (this.product.section == "cs3"){
  //     this.product.fees = 50;
  //   }else if (this.product.section == "Monitor"){
  //     this.product.fees = 40;
  //   }else if (this.product.section == "hdd") {
  //     this.product.fees = 75;
  //   }
  // }

  copyToClipboard() {
    navigator.clipboard.writeText(this.recieptId).then(() => {
      console.log("product ID copied to clipboard");
    }, (error) => {
      console.error("Failed to copy product ID to clipboard:", error);
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
              // if (this.role == 'technition') {
              //   this.disabled = true;
              //   if (this.product.repaired) {
              //     this.repairdone = true;
              //   }
              //   if (this.username == this.product.engineer){
              //     this.sameEng = true;
              //   }
              // }else if (this.role == 'receiver') {
              //   this.sameEng = true;
              // }else {
              //   this.sameEng = true;
              // }
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
      // if (this.receive.repaired) {
      //   this.repairdone = true;
      // }
    }
  }
  submit(form : NgForm): void {
    if (this.isNew) {
      this.product.purchasedate = this.getDate();
      this.updating = false;
      this.productsService.create(this.product).subscribe(
        (data) => {
          this.print = data;
          console.log(data._id);
          console.log(data);
          this.edited = true;
          this.recieptId = data._id.slice(-12);
          window.alert(`Success saving product ${data._id}. You can print now.`);
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
      console.log(this.product._id);
    } else {
      this.productsService.update(this.product._id, this.product).subscribe(
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
