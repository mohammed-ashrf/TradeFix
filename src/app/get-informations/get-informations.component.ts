import { Component,OnInit } from '@angular/core';
import { InformationService } from '../services/information.service';
import { Dealer,ProductSection,Section,Supplier,DollarPrice } from '../shared/information';
import { Location } from '@angular/common';
@Component({
  selector: 'app-get-informations',
  templateUrl: './get-informations.component.html',
  styleUrls: ['./get-informations.component.scss']
})
export class GetInformationsComponent implements OnInit{
  informationType: string = 'dealers';
  sections!: Section[];
  productSections!: ProductSection[];
  suppliers!: Supplier[];
  dealers!: Dealer[];
  dollarPrice: DollarPrice = {
    _id: '',
    price: 0,
    date: '',
  };
  isSearched:boolean = false;
  searchTerm:string = '';
  searchResult:any;
  notHidden:boolean = true;
  suppliersMoneyTotal: number = 0;
  suppliersMoneyPaid: number = 0;
  suppliersMonayOwing: number = 0;
  showData: boolean =false;
  paid: number = 0;
  owing: number = 0;
  total: number = 0;
  selectedSupplierId: string = '';
  constructor(private informationService: InformationService,
    private location: Location){}
  
  ngOnInit(): void {
    localStorage.setItem('informationType', this.informationType);
    this.informationService.getDealers().subscribe(
      (dealers) => {
        this.dealers = dealers;
      }
    )
  }

  whichInformation() {
    this.notHidden = true;
    if(this.informationType === 'sections'){
      this.informationService.getSections().subscribe(
        (sections) => {
          this.sections = sections;
          localStorage.setItem('informationType', this.informationType);
        }
      );
    }else if(this.informationType === 'product-sections'){
      this.informationService.getProductSections().subscribe(
        (productSections) => {
          this.productSections = productSections;
          localStorage.setItem('informationType', this.informationType);
        }
      );
    }else if (this.informationType === 'suppliers') {
      this.informationService.getSuppliers().subscribe(
        (suppliers) => {
          this.suppliers = suppliers;
          localStorage.setItem('informationType', this.informationType);
        }
      );
    }else if (this.informationType === 'dealers') {
      this.informationService.getDealers().subscribe(
        (dealers) => {
          this.dealers = dealers;
          localStorage.setItem('informationType', this.informationType);
        }
      );
    }else if (this.informationType === 'dollarPrice') {
      this.informationService.getDollatPrice().subscribe(
        (dollar) => {
          this.notHidden = false;
          this.dollarPrice = dollar;
          localStorage.setItem('informationType', this.informationType);
        }
      );
    }
  }

  calSuppliersMoney(){
    this.suppliersMoneyTotal = this.suppliers.reduce((total, supplier) => {
      return total + supplier.products.reduce((subTotal, product)=> {
        return subTotal + (product.purchasePrice * product.quantity);
      },0);
    },0);
    this.suppliersMoneyPaid = this.suppliers.reduce((total, supplier) => {
      return total + supplier.products.reduce((subTotal, product)=> {
        return subTotal + product.whatIsPaid
      },0);
    },0);
    this.suppliersMonayOwing = this.suppliersMoneyTotal - this.suppliersMoneyPaid;
  }

  calSupplierMoney(supplier : Supplier, supplierId: string) {
    this.paid = supplier.products.reduce((total,product) => {
      return total + product.whatIsPaid;
    },0);

    this.owing = supplier.products.reduce((total,product) => {
      return total + product.oweing;
    },0);
    console.log(supplier.products);
    this.showData = true;
    this.selectedSupplierId = supplierId;
  }

  searchProducts(products: any[], userInput: any) {
    try {
      if (typeof userInput !== 'string') {
        console.log('User input must be a string');
        throw new Error('User input must be a string');
      }
      userInput = userInput.toLowerCase();
      return products.filter(product => {
        for (let key in product) {
          if (product.hasOwnProperty(key) && product[key]?.toString().toLowerCase().includes(userInput.toLowerCase())) {
            // this.searchResults.push(device);
            const value = product[key].toString().toLowerCase();
            if (value.includes(userInput)) {
              this.isSearched = true;
              return true;
            }
            break;
          }
        }
        return false;
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  testInput(str: string) {
    return /[A-Za-z0-9\s\S]+/.test(str);
  }

  search() {
    if (this.informationType === 'dealers'){
      this.searchResult = this.searchProducts(this.dealers, this.searchTerm);
    }else if (this.informationType === 'sections'){
      this.searchResult = this.searchProducts(this.sections, this.searchTerm);
    }else if (this.informationType === 'product-sections'){
      this.searchResult = this.searchProducts(this.productSections, this.searchTerm);
    }else if (this.informationType === 'suppliers') {
      this.searchResult = this.searchProducts(this.suppliers, this.searchTerm);
    }
    console.log(this.searchResult);
  } 

  goBack(){
    this.location.back();
  }
}
