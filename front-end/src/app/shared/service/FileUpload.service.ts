import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

private apiUrl = 'http://localhost:5253/api/File';

  constructor(private http: HttpClient) {}

  uploadFile(file: File, folder: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
