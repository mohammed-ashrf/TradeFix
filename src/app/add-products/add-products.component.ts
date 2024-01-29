import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductSupplier } from '../shared/products';
import { ProductsService } from '../services/products.service';
import { InformationService, SupplierProductAdding } from '../services/information.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/auth/user';
import { ProductSection, SupplierProducts, Supplier } from '../shared/information';
import { SafeService } from '../services/safe.service';
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
    informationId: ''
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
  balance!: number;
  constructor(
    private productsService: ProductsService,
    private informationService: InformationService,
    private authService: AuthService,
    private safeService: SafeService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.preLocation = localStorage.getItem('location'); 
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
    const id = this.route.snapshot.paramMap.get('id');
    this.getInformations();
    if (id) {
      this.isNew = false;
      this.productsService.getOne(id).subscribe((product) => {
        product.userSellingPrice *= this.dollarPrice;
        product.deallerSellingPrice *= this.dollarPrice;
        product.deallerSellingPriceAll *= this.dollarPrice;
        Math.floor(product.userSellingPrice);
        Math.floor(product.deallerSellingPrice);
        Math.floor(product.deallerSellingPriceAll);
        this.product = product;
        this.recieptId = product._id.slice(-7);
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

  async addMoneyToSafe(amount: number) {
    await this.safeService.addMoney(amount, this.today, 'buyingProducts', `${this.user.username}, (${this.user._id})`).subscribe(
      (res) => {
        console.log('add money to safe');
      }
    )
  };

  async deductMoneyFromSafe(amount: number) {
    await this.safeService.deductMoney(amount, this.today, 'buyingProducts', `${this.user.username}, (${this.user._id})`).subscribe(
      (res) => {
        console.log('deduct money from safe');
      }
    )
  };

  async addSupplierProduct(productId: string) {
    let supplierProduct: SupplierProductAdding = {
      productId: '',
      productName: this.product.name,
      quantity: 0,
      purchasePrice: 0,
      purchasedate: '',
      whatIsPaid: 0,
      oweing: 0,
      _id: ''
    }
    if(this.isNew){
      console.log("isNew");
      supplierProduct.productId = productId;
      for (let i=0; i<= this.product.suppliers.length; i++){
        supplierProduct.quantity = this.product.suppliers[i].quantity;
        supplierProduct.purchasePrice = this.product.suppliers[i].purchasePrice;
        supplierProduct.purchasedate = this.product.suppliers[i].purchasedate;
        supplierProduct.whatIsPaid = this.product.suppliers[i].whatIsPaid;
        supplierProduct.oweing = this.product.suppliers[i].oweing;
        this.informationService.updateSupplierProducts(this.product.suppliers[i].id, supplierProduct).subscribe(
          (res) => {
            this.product.suppliers[i].informationId = res._id;
            this.deductMoneyFromSafe(this.product.suppliers[i].whatIsPaid);
          }
        );        
      };
      this.productsService.update(productId, this.product).subscribe(
        () => {
          console.log('updated');
        }
      )
    }else {
      supplierProduct.productId = this.product._id;
      supplierProduct.quantity = this.supplier.quantity;
      supplierProduct.purchasePrice = this.supplier.purchasePrice;
      supplierProduct.purchasedate = this.supplier.purchasedate;
      supplierProduct.whatIsPaid = this.supplier.whatIsPaid;
      supplierProduct.oweing = this.supplier.oweing;
      
      await this.informationService.updateSupplierProducts(this.supplier.id, supplierProduct).subscribe(
        (res) => {
          this.supplier.informationId = res._id;
          this.product.suppliers.push(this.supplier);
          this.product.quantity += this.supplier.quantity;
          this.deductMoneyFromSafe(this.supplier.whatIsPaid);
          this.supplier = {
            id: '',
            name: '',
            quantity: 0,
            purchasePrice: 0,
            purchasedate: '',
            whatIsPaid: 0,
            oweing: 0,
            informationId: '',
          };
        }
      );
    }
  }
  getSafeBalance(): any {
    this.safeService.getBalance()
      .subscribe((response: any) => {
        this.balance = response.balance;
        return response.balance;
      });
  }

  async addSupplier(){
    const cash = await this.getSafeBalance();
    if(this.supplier.whatIsPaid > cash) {
      window.alert("not enough Cash in the safe");
    }else {
      this.supplier.purchasedate = this.date;
      this.supplier.id = this.selectedSupplierId;
      if(!this.isNew){
        await this.addSupplierProduct(this.product._id);
        this.product.userSellingPrice = this.product.userSellingPrice / this.dollarPrice;
        this.product.deallerSellingPrice = this.product.deallerSellingPrice / this.dollarPrice;
        this.product.deallerSellingPriceAll = this.product.deallerSellingPriceAll / this.dollarPrice;
        Math.floor(this.product.userSellingPrice);
        Math.floor(this.product.deallerSellingPrice);
        Math.floor(this.product.deallerSellingPriceAll);
        this.productsService.update(this.product._id, this.product).subscribe(
          () => {
            this.product.userSellingPrice *= this.dollarPrice;
            this.product.deallerSellingPrice *= this.dollarPrice;
            this.product.deallerSellingPriceAll *= this.dollarPrice;
            Math.floor(this.product.userSellingPrice);
            Math.floor(this.product.deallerSellingPrice);
            Math.floor(this.product.deallerSellingPriceAll);
          }
        )
      }else {
        this.product.suppliers.push(this.supplier);
        this.product.quantity += this.supplier.quantity;
        this.supplier = {
          id: '',
          name: '',
          quantity: 0,
          purchasePrice: 0,
          purchasedate: '',
          whatIsPaid: 0,
          oweing: 0,
          informationId: '',
        };
      }
    }
  }
  deleteSupplierProduct(supplierIndex:number,productId: string) {
    this.informationService.deleteSupplierProduct(this.product.suppliers[supplierIndex].id, productId, this.product.suppliers[supplierIndex].informationId).subscribe(
      (res) => {
        this.addMoneyToSafe(this.product.suppliers[supplierIndex].whatIsPaid);
        console.log(res);
      }
    );
  }
  async deleteSupplier(index: number) {
    this.product.quantity -= this.product.suppliers[index].quantity;
    if(!this.isNew) {
      await this.deleteSupplierProduct(index, this.product._id);
      this.product.userSellingPrice = this.product.userSellingPrice / this.dollarPrice;
      this.product.deallerSellingPrice = this.product.deallerSellingPrice / this.dollarPrice;
      this.product.deallerSellingPriceAll = this.product.deallerSellingPriceAll / this.dollarPrice;
      Math.floor(this.product.userSellingPrice);
      Math.floor(this.product.deallerSellingPrice);
      Math.floor(this.product.deallerSellingPriceAll);
      this.productsService.update(this.product._id, this.product).subscribe(
        () => {
          this.product.userSellingPrice *= this.dollarPrice;
          this.product.deallerSellingPrice *= this.dollarPrice;
          this.product.deallerSellingPriceAll *= this.dollarPrice;
          Math.floor(this.product.userSellingPrice);
          Math.floor(this.product.deallerSellingPrice);
          Math.floor(this.product.deallerSellingPriceAll);
        }
      )
    }
    this.product.suppliers.splice(index, 1);
  }
  

  determineOweing(supplier : ProductSupplier) {
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

  getSelectedSupplierId(supplier: Supplier){
    console.log(supplier._id);
    this.selectedSupplierId = supplier._id;
    this.supplier.id = supplier._id;
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
    Math.floor(item.userSellingPrice);
    Math.floor(item.deallerSellingPrice);
    Math.floor(item.deallerSellingPriceAll);
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
    if (this.role == 'technition') {
      this.disabled = true;
    }
  }
  


  
  submit(form : NgForm): void {
    this.product.userSellingPrice = this.product.userSellingPrice / this.dollarPrice;
    this.product.deallerSellingPrice = this.product.deallerSellingPrice / this.dollarPrice;
    this.product.deallerSellingPriceAll = this.product.deallerSellingPriceAll / this.dollarPrice;
    Math.floor(this.product.userSellingPrice);
    Math.floor(this.product.deallerSellingPrice);
    Math.floor(this.product.deallerSellingPriceAll);
    if (this.isNew) {
      // this.product.purchasedate = this.getDate();
      this.updating = false;
      this.productsService.create(this.product).subscribe(
        async (data) => {
          this.print = data;
          this.edited = true;
          this.recieptId = data._id.slice(-12);
          await this.addSupplierProduct(data._id);
          window.alert(`Success saving product ${data._id}. You can print now.`);
          // navigator.clipboard.writeText(data._id);
          this.submited = true;
          this.isNew = false;
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