import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {User} from '@app/_models/user';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {CartService} from "@app/cart/service/cart.service";
import jwt_decode from "jwt-decode";



@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  private currentAdminSubject: BehaviorSubject<boolean>;
  public currentUser: Observable<User>;
  public currentAdmin: Observable<boolean>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentAdminSubject = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('isAdmin')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentAdmin = this.currentAdminSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }


  public get tokenUserCurrent(): string {
    return; // this.currentUserSubject.value.token;
  }
  login(email: string, password: string) {
    const optionRequete = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(`${environment.apiUrl}/authentication_token`, { email, password }, optionRequete)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);

        const jwtDecode = jwt_decode(user.token);
        // @ts-ignore
        if (jwtDecode.roles) {
          // @ts-ignore
          const roles = jwtDecode.roles;
          console.log('reol', roles);
          if (
            roles.indexOf('ROLE_ADMIN') !== -1
            || roles.indexOf('ROLE_SUPER_ADMIN') !== -1
          ) {
            // add icon and restaurant
            localStorage.setItem('isAdmin', 'true');
            this.currentAdminSubject.next(true);
          }
          return user;
        }
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    this.currentUserSubject.next(null);
    this.currentAdminSubject.next(null);
    this.router.navigate(['home']);
  }

  public checkIsAdmin() {
    const optionRequete = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.post<any>(`${environment.apiUrl}/is-admin`, {tokenUser: user.token },
      optionRequete
      );
  }
}
