import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeDetailPageRoutingModule } from './employee-detail-routing.module';

import { EmployeeDetailPage } from './employee-detail.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EmployeeDetailPageRoutingModule
  ],
  providers: [
    DecimalPipe
  ],
  declarations: [EmployeeDetailPage],
  exports: [EmployeeDetailPage]
})
export class EmployeeDetailPageModule { }
