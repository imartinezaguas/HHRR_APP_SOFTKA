import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { PaginatedResult } from '../models/paginated-result.model';

export interface EmployeeRepository {
    getAll(): Observable<Employee[]>;
    getById(id: string): Observable<Employee | undefined>;
    create(employee: Employee): Observable<void>;
    update(employee: Employee): Observable<void>;
    delete(id: string): Observable<void>;
    search(query: string, page: number, pageSize: number): Observable<PaginatedResult<Employee>>;
}
