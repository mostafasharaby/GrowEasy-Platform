import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { HandleErrorsService } from '../../shared/service/handle-errors.service';
import { AuthServiceService } from '../../pages/auth/auth-services/auth-service.service';
import { PaginatedUsers } from '../pages/Models/PaginatedUsers ';
import { User } from '../pages/Models/User';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.api}/Account`;

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService,
    private handleErrorService: HandleErrorsService
  ) {}

  // Get users
  getUsers(pageNumber: number = 1, pageSize: number = 10): Observable<User[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<PaginatedUsers>(`${this.baseUrl}/Users?PageNumber=${pageNumber}&PageSize=${pageSize}`, { headers }).pipe(
      map(response => response.data),
      tap(users => {
        console.log('Users fetched:', users.length);
      }),
      catchError(this.handleErrorService.handleError)
    );
  }

  updateUser(id: string, updatedUser: Partial<User>): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put(`${this.baseUrl}/update-user/${id}`, updatedUser, { headers }).pipe(
      tap(() => console.log(`User ${id} updated.`)),
      catchError(this.handleErrorService.handleError)
    );
  }

  deleteUser(userId: string): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.delete(`${this.baseUrl}/delete-user/${userId}`, { headers }).pipe(
      tap(() => console.log(`User ${userId} deleted.`)),
      catchError(this.handleErrorService.handleError)
    );
  }
}
