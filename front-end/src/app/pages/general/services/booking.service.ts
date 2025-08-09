import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { SnakebarService } from '../../../shared/service/SnakebarService.service';
import { AuthServiceService } from '../../auth/auth-services/auth-service.service';
import { HandleErrorsService } from '../../../shared/service/handle-errors.service';
import { environment } from '../../../../environments/environment';
import { Booking, CreateBookingDTO } from '../../models/Booking ';
import { ApiResponse } from '../../models/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private http: HttpClient,
    private snakebar: SnakebarService,
    private authService: AuthServiceService,
    private handleErrorService: HandleErrorsService
  ) { }

  private bookingApi = `${environment.api}/Bookings`;
  private eventApi = `${environment.api}/Events`;

  private bookingItemsSubject = new BehaviorSubject<Booking[]>([]);
  bookingItems$ = this.bookingItemsSubject.asObservable();

  public search = new BehaviorSubject<string>("");

  getBookingItems(): Observable<Booking[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<ApiResponse<Booking[]>>(this.bookingApi, { headers }).pipe(
      tap(response => {
        this.bookingItemsSubject.next(response.data);
        console.log('Bookings fetched:', response.data.length);
      }),
      map(response => response.data),
      catchError(this.handleErrorService.handleError)
    );
  }
  getBookingItemsForAUser(userId: string): Observable<Booking[]> {
    const headers = this.authService.getHeaders();
    const url = `${this.bookingApi}/user/${userId}`;
    
    return this.http.get<ApiResponse<Booking[]>>(url, { headers }).pipe(
      tap(response => {
        this.bookingItemsSubject.next(response.data);
        console.log('Bookings fetched:', response.data.length);
      }),
      map(response => response.data),
      catchError(this.handleErrorService.handleError)
    );
  }
  

  getEvents(): Observable<Event[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<ApiResponse<Event[]>>(this.eventApi, { headers }).pipe(
      map(response => response.data),
      tap(events => {
        console.log('Events fetched:', events.length);
      }),
      catchError(this.handleErrorService.handleError)
    );
  }

   addBooking(bookingRequest: CreateBookingDTO): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post(`${this.bookingApi}`, bookingRequest, { headers }).pipe(
      tap(() => {
        this.snakebar.showSnakeBar(`Event booked successfully!`);
        console.log('Booking created:', bookingRequest);
      }),
      catchError(this.handleErrorService.handleError)
    );
  }

  deleteBooking(bookingId: number): Observable<any> {
    const headers = this.authService.getHeaders();
    const deleteUrl = `${this.bookingApi}/${bookingId}`;
    return this.http.delete(deleteUrl, { headers }).pipe(
      tap(() => {
        this.snakebar.showSnakeBar(`Booking deleted successfully.`);
        console.log('Deleted booking id:', bookingId);
      }),
      catchError(this.handleErrorService.handleError)
    );
  }

  clearBookingItems() {
    this.bookingItemsSubject.next([]);
    console.log('Booking items cleared');
  }
}
