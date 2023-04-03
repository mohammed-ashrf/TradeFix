import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login/login.component';
import { RegisterComponent } from './auth/register/register/register.component';
import { DeviceListComponent } from './device/device-list/device-list/device-list.component';
import { DeviceFormComponent } from './device/device-form/device-form/device-form.component';
import { RepairListComponent } from './repair/repair-list/repair-list/repair-list.component';
import { RepairFormComponent } from './repair/repair-form/repair-form.component';
import { SearchComponent } from './search/search.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'devices', component: DeviceListComponent },
  { path: 'devices/new', component: DeviceFormComponent },
  { path: 'devices/:id/edit', component: DeviceFormComponent },
  { path: 'repairs', component: RepairListComponent },
  { path: 'repairs/new', component: RepairFormComponent },
  { path: 'search', component: SearchComponent},
  { path: 'print',  component: PrintLayoutComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}


