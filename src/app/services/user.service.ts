import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './../data-type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private environmentUrl = environment.apiUrl;  
  private UserApiUrl = this.environmentUrl + 'users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.UserApiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.UserApiUrl}/${id}`);
  }

  createUser(user: User): Observable<User> {    
    return this.http.post<User>(this.UserApiUrl, user);
  }
  updateUser(userId: number, userData: any): Observable<any> {
    const url = `${this.UserApiUrl}/${userId}`;
    return this.http.put(url, userData); 
  }

  deleteUser(id: number): Observable<User> {
    const updatedUser = { id, active: false };
    return this.http.patch<User>(`${this.UserApiUrl}/${id}`, updatedUser );
  }

}