import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EmployeeRepository } from '../../domain/repositories/employee.repository';
import {
    GetAllEmployeesUseCase,
    GetEmployeeByIdUseCase,
    CreateEmployeeUseCase,
    UpdateEmployeeUseCase,
    DeleteEmployeeUseCase,
    SearchEmployeesUseCase
} from './employee.usecases';

describe('Employee Use Cases', () => {
    let repositorySpy: jasmine.SpyObj<EmployeeRepository>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('EmployeeRepository', [
            'getAll', 'getById', 'create', 'update', 'delete', 'search'
        ]);

        TestBed.configureTestingModule({
            providers: [
                GetAllEmployeesUseCase,
                GetEmployeeByIdUseCase,
                CreateEmployeeUseCase,
                UpdateEmployeeUseCase,
                DeleteEmployeeUseCase,
                SearchEmployeesUseCase,
                { provide: 'EmployeeRepository', useValue: spy }
            ]
        });
        repositorySpy = TestBed.inject('EmployeeRepository' as any) as jasmine.SpyObj<EmployeeRepository>;
    });

    describe('GetAllEmployeesUseCase', () => {
        it('should return all employees from repository', (done) => {
            const useCase = TestBed.inject(GetAllEmployeesUseCase);
            const expectedEmployees: any[] = [{ id: '1', fullName: 'Test' }];
            repositorySpy.getAll.and.returnValue(of(expectedEmployees));

            useCase.execute().subscribe(employees => {
                expect(employees).toEqual(expectedEmployees);
                expect(repositorySpy.getAll).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('GetEmployeeByIdUseCase', () => {
        it('should return a specific employee from repository', (done) => {
            const useCase = TestBed.inject(GetEmployeeByIdUseCase);
            const expectedEmployee: any = { id: '1', fullName: 'Test' };
            repositorySpy.getById.and.returnValue(of(expectedEmployee));

            useCase.execute('1').subscribe(employee => {
                expect(employee).toEqual(expectedEmployee);
                expect(repositorySpy.getById).toHaveBeenCalledWith('1');
                done();
            });
        });
    });

    describe('CreateEmployeeUseCase', () => {
        it('should call create on repository', (done) => {
            const useCase = TestBed.inject(CreateEmployeeUseCase);
            const newEmployee: any = { fullName: 'New Employee' };
            repositorySpy.create.and.returnValue(of(void 0));

            useCase.execute(newEmployee).subscribe(() => {
                expect(repositorySpy.create).toHaveBeenCalledWith(newEmployee);
                done();
            });
        });
    });

    describe('UpdateEmployeeUseCase', () => {
        it('should call update on repository', (done) => {
            const useCase = TestBed.inject(UpdateEmployeeUseCase);
            const updatedEmployee: any = { id: '1', fullName: 'Updated' };
            repositorySpy.update.and.returnValue(of(void 0));

            useCase.execute(updatedEmployee).subscribe(() => {
                expect(repositorySpy.update).toHaveBeenCalledWith(updatedEmployee);
                done();
            });
        });
    });

    describe('DeleteEmployeeUseCase', () => {
        it('should call delete on repository', (done) => {
            const useCase = TestBed.inject(DeleteEmployeeUseCase);
            repositorySpy.delete.and.returnValue(of(void 0));

            useCase.execute('1').subscribe(() => {
                expect(repositorySpy.delete).toHaveBeenCalledWith('1');
                done();
            });
        });
    });

    describe('SearchEmployeesUseCase', () => {
        it('should call search on repository', (done) => {
            const useCase = TestBed.inject(SearchEmployeesUseCase);
            const mockResponse = { data: [], totalRecords: 0, page: 1, pageSize: 10 };
            repositorySpy.search.and.returnValue(of(mockResponse));

            useCase.execute('test', 1, 10).subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(repositorySpy.search).toHaveBeenCalledWith('test', 1, 10);
                done();
            });
        });
    });

});
