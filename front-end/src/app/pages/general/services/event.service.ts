import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AuthServiceService } from '../../auth/auth-services/auth-service.service';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventUrl = `${environment.api}/Events`;  

  constructor(private http: HttpClient, private authService: AuthServiceService) {}

  getAllEvents(): Observable<Event[]> {
    return this.http.get<ApiResponse<Event[]>>(this.eventUrl, {
      headers: this.authService.getHeaders()
    }).pipe(
      map(response => response.data)
    );
  }  

  addEvent(formData: FormData): Observable<string> {
  return this.http.post<ApiResponse<string>>(this.eventUrl, formData) 
    .pipe(
      map(response => response.data)
    );
}

  getEventById(eventID: number): Observable<Event> {
    return this.http.get<ApiResponse<Event>>(`${this.eventUrl}/${eventID}`, {
      headers: this.authService.getHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  updateEvent(eventID: number, formData: FormData): Observable<string> {
    return this.http.put<ApiResponse<string>>(`${this.eventUrl}/${eventID}`, formData).pipe(
      map(response => response.data)
    );
  }
  
  
  deleteEvent(eventID: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.eventUrl}/${eventID}`, {
      headers: this.authService.getHeaders()
    }).pipe(
      map(response => response.data)
    );
  }
  
  private resetSubject = new BehaviorSubject<boolean>(false);  
  resetObservable$ = this.resetSubject.asObservable();

  resetEvents() {
    this.resetSubject.next(true);
  }
}

