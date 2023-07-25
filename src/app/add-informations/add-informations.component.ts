import { Component, OnInit } from '@angular/core';
import { Section, ProductSection, Supplier,Dealer, DollarPrice } from '../shared/information';
import { ActivatedRoute } from '@angular/router';
import { InformationService } from '../services/information.service';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-informations',
  templateUrl: './add-informations.component.html',
  styleUrls: ['./add-informations.component.scss']
})
export class AddInformationsComponent implements OnInit {
  section: Section = {
    name: '',
    checkingFees: 0,
    description: '',
    _id: '',
  }

  productSection: ProductSection = {
    name: '',
    description: '',
    _id: ''
  }
  supplier: Supplier = {
    name: '',
    companyName: '',
    phone: '',
    notes: '',
    _id: '',
  }

  dealer: Dealer = {
    name:'',
    companyName: '',
    email: '',
    phone: '',
    notes: '',
    _id: '',
  }
 
  dollarPrice: DollarPrice = {
    price: 0,
    date: Date.now,
    _id: '',
  }

  isNew = true;
  isDealer = false;
  isSection = false;
  isProductSection = false;
  isSupplier = false;
  isDollarPrice = false;
  constructor(
    private informationService: InformationService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    let route = localStorage.getItem('informationType');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      if(route === 'dealers'){
        this.informationService.getOneDealer(id).subscribe((dealer) => {
          this.isDealer = true;
          this.dealer = dealer;
        });
      }else if (route === 'suppliers') {
        this.informationService.getOneSupplier(id).subscribe((supplier) => {
          this.isSupplier = true;
          this.supplier = supplier;
        });
      }else if(route === 'product-sections') {
        this.informationService.getOneProductSection(id).subscribe((productSection) => {
          this.isProductSection = true;
          this.productSection = productSection;
        });
      }else if ( route === 'sections') {
        this.informationService.getOneSection(id).subscribe(
          (section) => {
            this.isSection = true;
            this.section = section;
          }
        )
      }else if (route === 'dollarPrice') {
        this.informationService.getOneDollarPrice(id).subscribe(
          (dollarPrice) => {
            this.isDollarPrice = true;
            this.dollarPrice = dollarPrice;
          }
        )
      }
      
    }
  }
  goBack() {
    this.location.back();
  }

  

  submitSection(form: NgForm) {
    if (this.isNew) {
      this.informationService.addSection(this.section).subscribe(
        (section) => {
          window.alert(`Success saving section ${section.name}.`);
          form.resetForm();
        },(error) => {
          console.error('Error creating section:', error);
          window.alert('Error creating section. Please try again later.');
        }
      )
    }else {
      this.informationService.updateSection(this.section._id, this.section).subscribe(
        () => {
          window.alert(`Section Updated`);
        }, (error) => {
          console.error('Error updating section:', JSON.stringify(error));
          window.alert(`Error updating section: ${JSON.stringify(error)}. Please try again later.`);
        }
      )
    }
  }

  submitProductSection(form: NgForm) {
    if (this.isNew) {
      this.informationService.addProductSection(this.productSection).subscribe(
        (productSection) => {
          window.alert(`Success saving Product Section ${productSection.name}.`);
          form.resetForm();
        },(error) => {
          console.error('Error creating Product Section:', error);
          window.alert('Error creating Product Section. Please try again later.');
        }
      )
    }else {
      this.informationService.updateProductSection(this.productSection._id, this.productSection).subscribe(
        () => {
          window.alert(`Product Section Updated`);
        }, (error) => {
          console.error('Error updating Product Section:', JSON.stringify(error));
          window.alert(`Error updating Product Section: ${JSON.stringify(error)}. Please try again later.`);
        }
      )
    }
  }

  submintSupplier(form: NgForm) {
    if (this.isNew) {
      this.informationService.addSupplier(this.supplier).subscribe(
        (supplier) => {
          window.alert(`Success saving supplier ${supplier.name}.`);
          form.resetForm();
        },(error) => {
          console.error('Error creating supplier:', error);
          window.alert('Error creating supplier. Please try again later.');        }
      )
    }else {
      this.informationService.updateSupplier(this.supplier._id, this.supplier).subscribe(
        () => {
          window.alert('Supplier Updated');
        }, (error) => {
          console.error('Error updating supplier:', JSON.stringify(error));
          window.alert(`Error updating supplier: ${JSON.stringify(error)}. Please try again later.`);
        }
      )
    }
  }

  submintDealer(form: NgForm) {
    if (this.isNew) {
      this.informationService.addDealer(this.dealer).subscribe(
        (dealer) => {
          window.alert(`Success saving dealer ${dealer.name}.`);
          form.resetForm();
        },(error) => {
          console.error('Error creating dealer:', error);
          window.alert('Error creating dealer. Please try again later.');        }
      )
    }else {
      this.informationService.updateDealer(this.dealer._id, this.dealer).subscribe(
        () => {
          window.alert('Dealer Updated');
        }, (error) => {
          console.error('Error updating dealer:', JSON.stringify(error));
          window.alert(`Error updating dealer: ${JSON.stringify(error)}. Please try again later.`);
        }
      )
    }
  }

  submitDollarPrice(form: NgForm) {
    if(this.isNew) {
      this.informationService.addDollarPrice(this.dollarPrice).subscribe(
        (dollarPrice) => {
          window.alert(`Success saving dollar price ${dollarPrice.price}`);
          form.resetForm();
        },(error) => {
          console.error('Error creating dollar price:', error);
          window.alert('Error creating dollar price. Please try again later.'); 
        }
      )
    }else {
      this.informationService.updateDollatPrice(this.dollarPrice._id, this.dollarPrice).subscribe(
        () => {
          window.alert('dollar price updated');
        }, (error) => {
          console.error('Error creating dollar price:', error);
          window.alert('Error creating dollar price. Please try again later.');
        }
      )
    }
  }
}