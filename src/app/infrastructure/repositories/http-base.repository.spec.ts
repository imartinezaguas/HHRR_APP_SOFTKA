import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpBaseRepository } from './http-base.repository';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_URL, ERROR_UNEXPECTED, UNKNOWN_ERROR } from '../../core/constants/constants';

@Injectable({ providedIn: 'root' })
class TestRepository extends HttpBaseRepository {
    constructor(http: HttpClient) {
        super(http);
    }

    testGet(endpoint: string, params?: any) {
        return this.executeQuery(endpoint, params);
    }

    testPost(endpoint: string, body: any) {
        return this.executePost(endpoint, body);
    }

    testPut(endpoint: string, body: any) {
        return this.executePut(endpoint, body);
    }

    testDelete(endpoint: string) {
        return this.executeDelete(endpoint);
    }
}

describe('HttpBaseRepository', () => {
    let repository: TestRepository;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TestRepository]
        });
        repository = TestBed.inject(TestRepository);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('executeQuery should perform GET request', () => {
        const dummyData = { id: 1, name: 'Test' };

        repository.testGet('/test').subscribe(data => {
            expect(data).toEqual(dummyData);
        });

        const req = httpMock.expectOne(`${API_URL}/test`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyData);
    });

    it('executePost should perform POST request', () => {
        const dummyData = { id: 1, name: 'Test' };
        const payload = { name: 'Test' };

        repository.testPost('/test', payload).subscribe(data => {
            expect(data).toEqual(dummyData);
        });

        const req = httpMock.expectOne(`${API_URL}/test`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);
        req.flush(dummyData);
    });

    it('executePut should perform PUT request', () => {
        const dummyData = { id: 1, name: 'Updated' };
        const payload = { name: 'Updated' };

        repository.testPut('/test', payload).subscribe(data => {
            expect(data).toEqual(dummyData);
        });

        const req = httpMock.expectOne(`${API_URL}/test`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(payload);
        req.flush(dummyData);
    });

    it('executeDelete should perform DELETE request', () => {
        repository.testDelete('/test').subscribe(data => {
            expect(data).toBeTruthy();
        });

        const req = httpMock.expectOne(`${API_URL}/test`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });

    it('should handle 500 error in GET', () => {
        repository.testGet('/test').subscribe({
            next: () => fail('should have failed with 500 status'),
            error: (error) => {
                expect(error.status).toBe(500);
            }
        });

        const req = httpMock.expectOne(`${API_URL}/test`);
        req.flush('Error', { status: 500, statusText: 'Server Error' });
    });

    it('should handle 400 error in GET', () => {
        repository.testGet('/test').subscribe({
            next: () => fail('should have failed with 400 status'),
            error: (error) => {
                expect(error.status).toBe(400);
                expect(error.message).toBe('Bad Request');
            }
        });

        const req = httpMock.expectOne(`${API_URL}/test`);
        req.flush({ message: 'Bad Request' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 401 error in POST', () => {
        repository.testPost('/test', {}).subscribe({
            next: () => fail('should have failed with 401 status'),
            error: (error) => {
                expect(error.status).toBe(401);
                expect(error.message).toBe('Unauthorized');
            }
        });

        const req = httpMock.expectOne(`${API_URL}/test`);
        req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });

});
