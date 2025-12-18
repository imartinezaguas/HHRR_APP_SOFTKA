import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../domain/models/employee.model';
import { EmployeeRepository } from '../../domain/repositories/employee.repository';


@Injectable({
    providedIn: 'root'
})
export class GetAllEmployeesUseCase {
    constructor(@Inject('EmployeeRepository') private employeeRepository: EmployeeRepository) { }

    execute(): Observable<Employee[]> {
        return this.employeeRepository.getAll();
    }
}

@Injectable({
    providedIn: 'root'
})
export class GetEmployeeByIdUseCase {
    constructor(@Inject('EmployeeRepository') private employeeRepository: EmployeeRepository) { }

    execute(id: string): Observable<Employee | undefined> {
        return this.employeeRepository.getById(id);
    }
}

@Injectable({
    providedIn: 'root'
})
export class CreateEmployeeUseCase {
    constructor(@Inject('EmployeeRepository') private employeeRepository: EmployeeRepository) { }

    execute(employee: Employee): Observable<void> {
        return this.employeeRepository.create(employee);
    }
}

@Injectable({
    providedIn: 'root'
})
export class UpdateEmployeeUseCase {
    constructor(@Inject('EmployeeRepository') private employeeRepository: EmployeeRepository) { }

    execute(employee: Employee): Observable<void> {
        return this.employeeRepository.update(employee);
    }
}

@Injectable({
    providedIn: 'root'
})
export class DeleteEmployeeUseCase {
    constructor(@Inject('EmployeeRepository') private employeeRepository: EmployeeRepository) { }

    execute(id: string): Observable<void> {
        return this.employeeRepository.delete(id);
    }
}


@Injectable({
    providedIn: 'root'
})
export class SearchEmployeesUseCase {
    constructor(@Inject('EmployeeRepository') private employeeRepository: EmployeeRepository) { }

    execute(query: string, page: number, pageSize: number): Observable<any> {
        return this.employeeRepository.search(query, page, pageSize);
    }
}
