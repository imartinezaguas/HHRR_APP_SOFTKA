import { Component, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { CreateEmployeeUseCase, GetEmployeeByIdUseCase, UpdateEmployeeUseCase } from '../../../application/usecases/employee.usecases';
import { Employee } from '../../../domain/models/employee.model';
import { MESSAGE_SAVED, MESSAGE_UPDATED } from 'src/app/core/constants/constants';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.page.html',
  styleUrls: ['./employee-detail.page.scss'],
  standalone: false
})
export class EmployeeDetailPage implements OnInit {
  @Input() id: string | null = null; // Received from Modal
  employeeForm: FormGroup;
  isNew = true;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private createEmployeeUseCase: CreateEmployeeUseCase,
    private updateEmployeeUseCase: UpdateEmployeeUseCase,
    private getEmployeeByIdUseCase: GetEmployeeByIdUseCase,
    private decimalPipe: DecimalPipe,
    private toastController: ToastController
  ) {
    this.employeeForm = this.fb.group({
      fullName: ['', Validators.required],
      position: ['', Validators.required],
      department: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      hireDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.id) {
      this.isNew = false;
      this.loadEmployee(this.id);
    }
  }

  loadEmployee(id: string) {
    this.getEmployeeByIdUseCase.execute(id).subscribe(employee => {
      if (employee) {
        this.employeeForm.patchValue({
          fullName: employee.fullName,
          position: employee.position,
          department: employee.department,
          salary: this.formatCurrency(employee.salary),
          hireDate: String(employee.hireDate).split('T')[0]
        });
      }
    });
  }

  formatSalary(event: any) {
    const input = event.target;
    let value = input.value;

    if (!value) return;

    let cleanVal = value.toString().replace(/[^0-9,]/g, '');

    const parts = cleanVal.split(',');
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? ',' + parts[1].substring(0, 2) : '';

    if (integerPart) {
      integerPart = this.decimalPipe.transform(integerPart.replace(/\./g, ''), '1.0-0') || integerPart;
    }

    input.value = integerPart + decimalPart;
    this.employeeForm.get('salary')?.setValue(input.value, { emitEvent: false });
  }

  private formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-2') || '';
  }

  private parseSalary(value: string | number): number {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    let cleanVal = value.replace(/\./g, '');
    cleanVal = cleanVal.replace(',', '.');
    return parseFloat(cleanVal);
  }

  saveUser() {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      const employee: Employee = {
        fullName: formValue.fullName,
        position: formValue.position,
        department: formValue.department,
        salary: this.parseSalary(formValue.salary),
        hireDate: formValue.hireDate ? (formValue.hireDate.includes('T') ? formValue.hireDate : `${formValue.hireDate}T00:00:00`) : new Date().toISOString()
      };

      if (!this.isNew && this.id) {
        employee.id = this.id;
      }

      if (this.isNew) {
        this.showToast(MESSAGE_SAVED);
        this.createEmployeeUseCase.execute(employee).subscribe(() => {
          this.modalCtrl.dismiss({ saved: true });
        });
      } else {
        this.showToast(MESSAGE_UPDATED);
        this.updateEmployeeUseCase.execute(employee).subscribe(() => {
          this.modalCtrl.dismiss({ saved: true });
        });
      }
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  showToast(message: string) {
    this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    }).then(toast => toast.present());
  }

}
