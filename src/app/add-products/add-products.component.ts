import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductSupplier } from '../shared/products';
import { ProductsService } from '../services/products.service';
import { InformationService } from '../services/information.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/auth/user';
import { ProductSection, SupplierProducts, Supplier } from '../shared/information';
@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit{
  supplier:ProductSupplier = {
    id: '',
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

  supplierProducts: SupplierProducts[] = [];
  submited: boolean = false;
  updating: boolean = false;
  isNew = true;

  allSuppliers:Supplier[] = [];
  selectedSupplierId: string = '';
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
  suppliers!: ProductSupplier[];
  dollarPrice: number = 0;
  searchResult!: Product[];
  products!: Product[];
  searchTerm!: string;
  isSearched!: boolean;
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
    this.getInformations();
    if (id) {
      this.isNew = false;
      this.productsService.getOne(id).subscribe((product) => {
        product.userSellingPrice *= this.dollarPrice;
        product.deallerSellingPrice *= this.dollarPrice;
        product.deallerSellingPriceAll *= this.dollarPrice;
        this.product = product;
        this.recieptId = product._id.slice(-7);
        this.calTotalQuantity();
        // this.date = product.purchasedate;
      });
    }
    this.getProducts();
    this.date = this.getDate();
    this.today = this.getDate();
    this.getUsers();
    if (this.isNew) {
      console.log('isNew');
    }else {
      this.updating = true;
    }
  }

  addSupplier(){
    this.supplier.purchasedate = this.date;
    this.supplier.id = this.selectedSupplierId;
    this.product.suppliers.push(this.supplier);
    this.calTotalQuantity();
    this.supplier = {
      id: '',
      name: '',
      quantity: 0,
      purchasePrice: 0,
      purchasedate: '',
      whatIsPaid: 0,
      oweing: 0,
    };
  }

  deleteSupplier(index: number) {
    this.product.suppliers.splice(index, 1);
  }  

  determineOweing(supplier : ProductSupplier) {
    supplier.oweing = (supplier.quantity * supplier.purchasePrice) - supplier.whatIsPaid;
    this.calTotalQuantity();
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

  getSelectedSupplierId(supplier: Supplier){
    console.log(supplier._id);
    this.selectedSupplierId = supplier._id;
    this.supplier.id = supplier._id;
  }

  calTotalQuantity() {
    if (this.product['suppliers'].length === 0) {
      this.product.quantity = 0;
    }else {
      this.product.quantity = this.product['suppliers'].reduce((total, supplier)=> {
        return total + supplier.quantity;
      },0);
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
  getProducts() {
    this.productsService.getAll().subscribe(
      (products) => {
        this.products = products;
      }
    );
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
      this.isSearched = true;
  }

  onSelect(item: Product) {
    item.userSellingPrice *= this.dollarPrice;
    item.deallerSellingPrice *= this.dollarPrice;
    item.deallerSellingPriceAll *= this.dollarPrice;
    this.product = item;
    this.searchTerm = '';
    this.isSearched = false;
    this.isNew = false;
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
  addSupplierProduct(productId: string) {
    if(this.isNew){
      console.log("isNew");
      let supplierProduct: SupplierProducts = {
        id: productId,
        name: this.product.name,
        quantity: this.product.quantity,
        purchasePrice: 0,
        purchasedate: '',
        whatIsPaid: 0,
        oweing: 0
      }
      for (let i = 0; i < this.product.suppliers.length; i++) {
        supplierProduct.purchasePrice = this.product.suppliers[i].purchasePrice;
        supplierProduct.purchasedate = this.product.suppliers[i].purchasedate;
        supplierProduct.whatIsPaid = this.product.suppliers[i].whatIsPaid;
        supplierProduct.oweing = this.product.suppliers[i].oweing;
        this.informationService.updateSupplierProducts(this.product.suppliers[i].id, this.product._id, supplierProduct);
      }
    }else {
      let supplierProduct: SupplierProducts = {
        id: this.product._id,
        name: this.product.name,
        quantity: this.product.quantity,
        purchasePrice: 0,
        purchasedate: '',
        whatIsPaid: 0,
        oweing: 0
      }
      for (let i = 0; i < this.product.suppliers.length; i++) {
        supplierProduct.purchasePrice = this.product.suppliers[i].purchasePrice;
        supplierProduct.purchasedate = this.product.suppliers[i].purchasedate;
        supplierProduct.whatIsPaid = this.product.suppliers[i].whatIsPaid;
        supplierProduct.oweing = this.product.suppliers[i].oweing;
        this.informationService.updateSupplierProducts(this.product.suppliers[i].id, this.product._id, supplierProduct);
      }
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
        async (data) => {
          this.print = data;
          await this.addSupplierProduct(data._id);
          console.log(data._id);
          console.log(data);
          this.edited = true;
          this.recieptId = data._id.slice(-12);
          window.alert(`Success saving product ${data._id}. You can print now.`);
          // navigator.clipboard.writeText(data._id);
          this.submited = true;
          if (this.notBack){
            form.resetForm();
            this.product.suppliers = [];
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
        async () => {
          await this.addSupplierProduct(this.product._id);
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
