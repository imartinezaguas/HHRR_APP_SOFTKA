import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../domain/models/employee.model';
import { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { HttpBaseRepository } from './http-base.repository';

import { PaginatedResult } from '../../domain/models/paginated-result.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeRepositoryApi extends HttpBaseRepository implements EmployeeRepository {

    getAll(): Observable<Employee[]> {
        return this.executeQuery<Employee[]>('/employees');
    }

    getById(id: string): Observable<Employee | undefined> {
        return this.executeQuery<Employee>(`/employees/${id}`);
    }

    create(employee: Employee): Observable<void> {
        return this.executePost<void>('/employees', employee);
    }

    update(employee: Employee): Observable<void> {
        return this.executePut<void>(`/employees/${employee.id}`, employee);
    }

    delete(id: string): Observable<void> {
        return this.executeDelete<void>(`/employees/${id}`);
    }

    search(query: string, page: number, pageSize: number): Observable<PaginatedResult<Employee>> {
        return this.executeQuery<PaginatedResult<Employee>>(`/employees/search?term=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`);
    }

}
