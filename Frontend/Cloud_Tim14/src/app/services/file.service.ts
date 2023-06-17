import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileService {
  
  constructor(private http: HttpClient) { 
  }
  
  public uploadFile (fileObj:any): Observable<any> {
    return this.http.post(`${environment.baseUrl}upload-file`, fileObj);
  }
  
  public uploadMetaData(fileInfoParams: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}upload-metadata`, fileInfoParams);
  }

  public getFolders(): Observable<any> {
    return this.http.get(`${environment.baseUrl}folders`);
  }

  public getMetaData(filepath:string):Observable<any>{
    return this.http.put(`${environment.baseUrl}metadata`, {"path":filepath});
  }
}