import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login/login.component';
import { RegisterComponent } from './auth/register/register/register.component';
import { DeviceListComponent } from './device/device-list/device-list/device-list.component';
import { DeviceFormComponent } from './device/device-form/device-form/device-form.component';
import { NgxPrintModule } from 'ngx-print';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SearchComponent } from './search/search.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AdminSearchComponent } from './admin-search/admin-search.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ProductsComponent } from './products/products.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { SellComponent } from './sell/sell.component';
import { AddInformationsComponent } from './add-informations/add-informations.component';
import { GetInformationsComponent } from './get-informations/get-informations.component';
import { GetUsersComponent } from './get-users/get-users.component';
import { SoldCartsComponent } from './sold-carts/sold-carts.component';
import { CartDialogComponent } from './cart-dialog/cart-dialog.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { StatsComponent } from './stats/stats.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DeviceListComponent,
    DeviceFormComponent,
    SearchComponent,
    PrintLayoutComponent,
    AdminPageComponent,
    AdminSearchComponent,
    UserDashboardComponent,
    ProductsComponent,
    AddProductsComponent,
    SellComponent,
    AddInformationsComponent,
    GetInformationsComponent,
    GetUsersComponent,
    SoldCartsComponent,
    CartDialogComponent,
    ConfirmationModalComponent,
    AlertModalComponent,
    ToolbarComponent,
    StatsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatDialogModule,
    MatListModule,
    MatGridListModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    NgxPrintModule,
    MatIconModule,
    MatTableModule,
    ModalModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
