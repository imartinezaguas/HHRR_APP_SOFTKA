import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeDetailPage } from './employee-detail.page';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModalController, IonicModule } from '@ionic/angular';
import { CreateEmployeeUseCase, UpdateEmployeeUseCase, GetEmployeeByIdUseCase } from '../../../application/usecases/employee.usecases';
import { DecimalPipe } from '@angular/common';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EmployeeDetailPage', () => {
  let component: EmployeeDetailPage;
  let fixture: ComponentFixture<EmployeeDetailPage>;

  let createSpy: jasmine.SpyObj<CreateEmployeeUseCase>;
  let updateSpy: jasmine.SpyObj<UpdateEmployeeUseCase>;
  let getByIdSpy: jasmine.SpyObj<GetEmployeeByIdUseCase>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    createSpy = jasmine.createSpyObj('CreateEmployeeUseCase', ['execute']);
    updateSpy = jasmine.createSpyObj('UpdateEmployeeUseCase', ['execute']);
    getByIdSpy = jasmine.createSpyObj('GetEmployeeByIdUseCase', ['execute']);
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      declarations: [EmployeeDetailPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [
        FormBuilder,
        DecimalPipe,
        { provide: ModalController, useValue: modalCtrlSpy },
        { provide: CreateEmployeeUseCase, useValue: createSpy },
        { provide: UpdateEmployeeUseCase, useValue: updateSpy },
        { provide: GetEmployeeByIdUseCase, useValue: getByIdSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.employeeForm).toBeDefined();
  });

  it('should load employee for editing', () => {
    const mockEmployee: any = {
      id: '123',
      fullName: 'John',
      position: 'Dev',
      department: 'IT',
      salary: 1000,
      hireDate: '2023-01-01T00:00:00'
    };
    getByIdSpy.execute.and.returnValue(of(mockEmployee));

    component.id = '123';
    fixture.detectChanges(); // triggers ngOnInit

    expect(component.isNew).toBeFalse();
    expect(getByIdSpy.execute).toHaveBeenCalledWith('123');
    expect(component.employeeForm.get('fullName')?.value).toBe('John');
  });

  it('should create employee when form is valid and isNew is true', () => {
    component.isNew = true;
    component.employeeForm.patchValue({
      fullName: 'New User',
      position: 'Dev',
      department: 'IT',
      salary: '1.000',
      hireDate: '2023-01-01'
    });
    createSpy.execute.and.returnValue(of(void 0));

    component.saveUser();

    expect(createSpy.execute).toHaveBeenCalled();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalledWith({ saved: true });
  });

  it('should update employee when form is valid and isNew is false', () => {
    component.isNew = false;
    component.id = '123';
    component.employeeForm.patchValue({
      fullName: 'Updated User',
      position: 'Dev',
      department: 'IT',
      salary: '2.000',
      hireDate: '2023-01-01'
    });
    updateSpy.execute.and.returnValue(of(void 0));

    component.saveUser();

    expect(updateSpy.execute).toHaveBeenCalled();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalledWith({ saved: true });
  });

  it('should format salary currency', () => {
    // Test logic of formatSalary method indirectly or directly if exposed
    const input = { target: { value: '1000' } };
    component.formatSalary(input);
    // Assuming locale 'en-US' or default angular locale for 1.0-2 pattern usually 1,000.00
    // But since formatCurrency uses '1.0-0' for integer part in formatSalary implementation: 
    // cleanVal = value replaced, integerPart = parts[0]... transform(integerPart, '1.0-0')
    // If we input '1000', expected '1,000' or similar based on locale.
    // Let's verify it changes the value.
    expect(input.target.value).not.toBe('1000');
  });

  it('should parse salary correctly on save', () => {
    component.isNew = true;
    component.employeeForm.patchValue({
      fullName: 'Rich User',
      position: 'CEO',
      department: 'Admin',
      salary: '1.000,50', // European/South American style input often handled by users
      hireDate: '2023-01-01'
    });

    // We spy on create and check what it receives
    createSpy.execute.and.returnValue(of(void 0));
    component.saveUser();

    expect(createSpy.execute).toHaveBeenCalled();
    const calledArg = createSpy.execute.calls.mostRecent().args[0];
    // Our parse logic: replace . with '', replace , with . -> 1000.50
    expect(calledArg.salary).toBe(1000.5);
  });

  it('should not save if invalid', () => {
    component.employeeForm.patchValue({ fullName: '' }); // Invalid
    component.saveUser();
    expect(createSpy.execute).not.toHaveBeenCalled();
    expect(updateSpy.execute).not.toHaveBeenCalled();
  });

  it('should close modal', () => {
    component.close();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalled();
  });
});
