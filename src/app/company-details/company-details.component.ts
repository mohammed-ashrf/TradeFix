import { Component } from '@angular/core';
import { CompanyService } from '../services/company.service';
@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent {
  selectedPhoto!: File;
  description!: string;
  tags!: string;
  name!: string;
  phoneNumber!: string;

  constructor(private companyService: CompanyService) {}

  onPhotoSelect(event: any): void {
    this.selectedPhoto = event.target.files[0];
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('photo', this.selectedPhoto);
    formData.append('description', this.description);
    formData.append('tags', this.tags);

    this.companyService.createCompany(formData)
      .subscribe(
        () => {
          console.log('Company created successfully');
          // Handle success
        },
        (error) => {
          console.error('Error creating company:', error);
          // Handle error
        }
      );
  }
}
