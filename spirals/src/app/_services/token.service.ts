import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { httpOptions } from './constants';

const SPIRAL_API_URL = "https://geneticchain.io/api/project/1/"

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) { }

  getMetadata(id: number = 1): Observable<any> {
    return this.http.get(`${SPIRAL_API_URL}token/${id}/meta`, httpOptions);
  }
}
