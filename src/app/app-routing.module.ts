import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login/login.component';
import { RegisterComponent } from './auth/register/register/register.component';
import { GetUsersComponent } from './get-users/get-users.component';
import { DeviceListComponent } from './device/device-list/device-list/device-list.component';
import { DeviceFormComponent } from './device/device-form/device-form/device-form.component';
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

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/:id/edit', component: RegisterComponent },
  { path: 'users', component: GetUsersComponent},
  { path: 'devices', component: DeviceListComponent },
  { path: 'devices/new', component: DeviceFormComponent },
  { path: 'devices/:id/edit', component: DeviceFormComponent },
  { path: 'search', component: SearchComponent},
  { path: 'print',  component: PrintLayoutComponent},
  { path: 'admin', component: AdminPageComponent },
  { path: 'adminSearch', component: AdminSearchComponent },
  { path: 'userDashboard', component: UserDashboardComponent },
  { path: 'products', component: ProductsComponent},
  { path: 'addProduct', component: AddProductsComponent},
  { path: 'sell', component: SellComponent},
  { path: 'addInformation', component: AddInformationsComponent},
  { path: 'addInformation/:id/edit', component: AddInformationsComponent },
  { path: 'informations', component: GetInformationsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}


