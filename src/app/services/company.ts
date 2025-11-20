import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompanyModel } from '../models/company';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private base = 'https://mini-crm-d44e8-default-rtdb.europe-west1.firebasedatabase.app';

  constructor(private http: HttpClient) {}

  addCompany(company: CompanyModel): Observable<any> {
    return this.http.post(this.base + '/companies.json', company);
  }

  getCompanies(): Observable<any[]> {
    return this.http.get<{ [key: string]: CompanyModel }>(
      this.base + '/companies.json'
    ).pipe(
      map(data => {
        if (!data) return [];
        return Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      })
    );
  }
}
