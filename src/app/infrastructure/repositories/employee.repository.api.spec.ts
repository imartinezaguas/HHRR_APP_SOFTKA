import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeRepositoryApi } from './employee.repository.api';
import { API_URL } from '../../core/constants/constants';

describe('EmployeeRepositoryApi', () => {
    let repository: EmployeeRepositoryApi;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EmployeeRepositoryApi]
        });
        repository = TestBed.inject(EmployeeRepositoryApi);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('getAll should return employees', () => {
        const dummyEmployees = [{ id: '1', fullName: 'Test' }];
        repository.getAll().subscribe(employees => {
            expect(employees.length).toBe(1);
            expect(employees).toEqual(dummyEmployees as any);
        });

        const req = httpMock.expectOne(`${API_URL}/employees`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyEmployees);
    });

    it('search should construct correct query params', () => {
        const dummyResult = { data: [], totalRecords: 0, page: 1, pageSize: 10 };
        const query = 'john doe';
        const page = 1;
        const pageSize = 10;

        repository.search(query, page, pageSize).subscribe(result => {
            expect(result).toEqual(dummyResult);
        });

        const encodedQuery = encodeURIComponent(query);
        const req = httpMock.expectOne(`${API_URL}/employees/search?term=${encodedQuery}&page=${page}&pageSize=${pageSize}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyResult);
    });

    it('create should post employee data', () => {
        const employee: any = { fullName: 'New' };
        repository.create(employee).subscribe(res => {
            expect(res).toBeNull();
        });

        const req = httpMock.expectOne(`${API_URL}/employees`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(employee);
        req.flush(null);
    });

    it('update should put employee data', () => {
        const employee: any = { id: '123', fullName: 'Updated' };
        repository.update(employee).subscribe(res => {
            expect(res).toBeNull();
        });

        const req = httpMock.expectOne(`${API_URL}/employees/123`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(employee);
        req.flush(null);
    });

    it('delete should call delete endpoint', () => {
        repository.delete('123').subscribe(res => {
            expect(res).toBeNull();
        });

        const req = httpMock.expectOne(`${API_URL}/employees/123`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });
});
