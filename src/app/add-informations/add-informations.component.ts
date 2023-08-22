import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Section, ProductSection, Supplier,Dealer, DollarPrice } from '../shared/information';
import { ActivatedRoute } from '@angular/router';
import { InformationService } from '../services/information.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
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
    products: [],
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
  informationType: string = 'sections';
  constructor(
    private informationService: InformationService,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
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

  async showAlert(message: string): Promise<void> {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      width: '400px',
      data: { message: message },
    });
  
    await dialogRef.afterClosed().toPromise();
  }

  submitSection(form: NgForm) {
    if (this.isNew) {
      this.informationService.addSection(this.section).subscribe(
        (section) => {
          let message = `Success saving section ${section.name}.`;
          this.showAlert(message);
          form.resetForm();
        },(error) => {
          console.error('Error creating section:', error);
          this.showAlert('Error creating section. Please try again later.');
        }
      )
    }else {
      this.informationService.updateSection(this.section._id, this.section).subscribe(
        () => {
          let message = `Section Updated`;
          this.showAlert(message);
        }, (error) => {
          console.error('Error updating section:', JSON.stringify(error));
          this.showAlert(`Error updating section: ${JSON.stringify(error)}. Please try again later.`);
        }
      )
    }
  }

  submitProductSection(form: NgForm) {
    if (this.isNew) {
      this.informationService.addProductSection(this.productSection).subscribe(
        (productSection) => {
          let message = `Success saving Product Section ${productSection.name}.`;
          this.showAlert(message);
          form.resetForm();
        },(error) => {
          console.error('Error creating Product Section:', error);
          this.showAlert('Error creating Product Section. Please try again later.');
        }
      )
    }else {
      this.informationService.updateProductSection(this.productSection._id, this.productSection).subscribe(
        () => {
          let message = `Product Section Updated`;
          this.showAlert(message);
        }, (error) => {
          console.error('Error updating Product Section:', JSON.stringify(error));
          this.showAlert(`Error updating Product Section: ${JSON.stringify(error)}. Please try again later.`);
        }
      )
    }
  }

  submintSupplier(form: NgForm) {
    if (this.isNew) {
      this.informationService.addSupplier(this.supplier).subscribe(
        (supplier) => {
          let message = `Success saving supplier ${supplier.name}.`;
          this.showAlert(message);
          form.resetForm();
        },(error) => {
          console.error('Error creating supplier:', error);
          this.showAlert('Error creating supplier. Please try again later.');        }
      )
    }else {
      this.informationService.updateSupplier(this.supplier._id, this.supplier).subscribe(
        () => {
          window.alert('Supplier Updated');
        }, (error) => {
          console.error('Error updating supplier:', JSON.stringify(error));
          this.showAlert(`Error updating supplier: ${JSON.stringify(error)}. Please try again later.`);
        }
      )
    }
  }

  submintDealer(form: NgForm) {
    if (this.isNew) {
      this.informationService.addDealer(this.dealer).subscribe(
        async (dealer) => {
          let message = `Success saving dealer ${dealer.name}.`;
          await this.showAlert(message);
          form.resetForm();
        },(error) => {
          console.error('Error creating dealer:', error);
          this.showAlert('Error creating dealer. Please try again later.');        }
      )
    }else {
      this.informationService.updateDealer(this.dealer._id, this.dealer).subscribe(
        async () => {
         await this.showAlert('Dealer Updated');
        }, (error) => {
          console.error('Error updating dealer:', JSON.stringify(error));
          this.showAlert(`Error updating dealer: ${JSON.stringify(error)}. Please try again later.`);
        }
      )
    }
  }

  submitDollarPrice(form: NgForm) {
    if(this.isNew) {
      this.informationService.addDollarPrice(this.dollarPrice).subscribe(
        (dollarPrice) => {
          let message = `Success saving dollar price ${dollarPrice.price}`
          this.showAlert(message);
          form.resetForm();
        },(error) => {
          console.error('Error creating dollar price:', error);
          this.showAlert('Error creating dollar price. Please try again later.'); 
        }
      )
    }else {
      this.informationService.updateDollatPrice(this.dollarPrice._id, this.dollarPrice).subscribe(
        () => {
          let message = 'dollar price updated';
          this.showAlert(message);
        }, (error) => {
          console.error('Error creating dollar price:', error);
          this.showAlert('Error creating dollar price. Please try again later.');
        }
      )
    }
  }
}
