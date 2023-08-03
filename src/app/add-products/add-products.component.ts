import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, Supplier } from '../shared/products';
import { ProductsService } from '../services/products.service';
import { InformationService } from '../services/information.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/auth/user';
import { ProductSection } from '../shared/information';
@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit{
  supplier:Supplier = {
    name: '',
    quantity: 0,
    purchasePrice: 0,
    purchasedate: '',
    whatIsPaid: 0,
    oweing: 0,
  };
  product: Product = {
    name: '',
    description: '',
    deallerSellingPrice: 0,
    deallerSellingPriceAll: 0,
    userSellingPrice: 0,
    category: '',
    status: '',
    quantity: 0,
    sellingdate: '',
    _id: '',
    suppliers: [],
    quantitySold: 0,
  };
  print: Product = {
    name: '',
    description: '',
    deallerSellingPrice: 0,
    deallerSellingPriceAll: 0,
    userSellingPrice: 0,
    category: '',
    status: '',
    quantity: 0,
    sellingdate: '',
    _id: '',
    suppliers: [],
    quantitySold:0,
  };
  submited: boolean = false;
  updating: boolean = false;
  isNew = true;

  allSuppliers:any;
  edited:boolean = false;
  recieptId:any;
  date:any;
  today: any;
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
  productSections!: ProductSection[];
  totalQuantity!:number;
  suppliers!: Supplier[];
  dollarPrice: any;
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
        // this.date = product.purchasedate;
      });
    }
    this.getInformations();
    this.date = this.getDate();
    this.today = this.getDate();
    this.getUsers();
    if (this.isNew) {
      this.addSupplier();
      console.log('isNew');
    }else {
      this.updating = true;
    }
    this.calTotalQuantity();
  }

  // addSupplier() {
  //   if (this.product.suppliers.length > 0) {
  //     // Get the last supplier in the array
  //     const lastSupplier = this.product.suppliers[this.product.suppliers.length - 1];
  //     // Create a new supplier object with the same date as the last supplier
  //     const newSupplier = {
  //       name: '',
  //       quantity: 0,
  //       purchasePrice: 0,
  //       purchasedate: lastSupplier.purchasedate,
  //       whatIsPaid: 0,
  //       oweing: 0,
  //     };
  //     // Add the new supplier to the end of the array
  //     this.product.suppliers.push(newSupplier);
  //   } else {
  //     // If there are no existing suppliers, create a new supplier with the current date
  //     const newSupplier = {
  //       name: '',
  //       quantity: 0,
  //       purchasePrice: 0,
  //       purchasedate: this.date,
  //       whatIsPaid: 0,
  //       oweing: 0,
  //     };
  //     // Add the new supplier to the suppliers array
  //     this.product.suppliers.push(newSupplier);
  //   }
  // }

  addSupplier() {
    const lastSupplier = this.product.suppliers[this.product.suppliers.length - 1];
    const newSupplier = {
      name: '',
      quantity: 0,
      purchasePrice: 0,
      purchasedate: lastSupplier ? lastSupplier.purchasedate : this.date,
      whatIsPaid: 0,
      oweing: 0,
    };
    this.product.suppliers.push(newSupplier);
  }

  deleteSupplier(index: number) {
    this.product.suppliers.splice(index, 1);
  }  

  determineOweing(supplier : Supplier) {
    supplier.oweing = (supplier.quantity * supplier.purchasePrice) - supplier.whatIsPaid;
  }

  getInformations(){
    this.informationService.getSuppliers().subscribe(
      (suppliers) => {
        this.allSuppliers = suppliers;
      }
    );
    this.informationService.getProductSections().subscribe(
      (productSections) => {
        this.productSections = productSections;
      }
    );
    this.informationService.getDollatPrice().subscribe(
      (dollar) => {
        let index = 'price';
        this.dollarPrice = dollar[index as keyof typeof dollar];
        console.log(this.dollarPrice);
      }
    )
  }

  calTotalQuantity() {
    if (this.product['suppliers'].length === 0) {
      this.totalQuantity = 0;
    }else {
      for(let i = 0; i<= this.product['suppliers'].length; i++) {
        this.totalQuantity += this.product['suppliers'][i].quantity;
      }
    }
    this.product.quantity = this.totalQuantity;
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
    this.product.userSellingPrice = this.product.userSellingPrice / this.dollarPrice;
    this.product.deallerSellingPrice = this.product.deallerSellingPrice / this.dollarPrice;
    this.product.deallerSellingPriceAll = this.product.deallerSellingPriceAll / this.dollarPrice;
    if (this.isNew) {
      // this.product.purchasedate = this.getDate();
      this.updating = false;
      this.productsService.create(this.product).subscribe(
        (data) => {
          this.print = data;
          console.log(data._id);
          console.log(data);
          this.edited = true;
          this.recieptId = data._id.slice(-12);
          window.alert(`Success saving product ${data._id}. You can print now.`);
          // navigator.clipboard.writeText(data._id);
          this.submited = true;
          if (this.notBack){
            form.resetForm();
          }
        },
        (error) => {
          console.error('Error creating product:', error);
          window.alert(`Error creating product. ${JSON.stringify(error)}`);
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
          console.error('Error updating product:', JSON.stringify(error));
          window.alert(`Error updating product: ${JSON.stringify(error)}. Please try again later.`);
        }
      );
    }
  }
}
