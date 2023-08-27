import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {environment} from "../../../environments/environment.development";
import {TokensType} from "../../../types/tokens.type";
import {UserService} from "../../shared/services/user.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';
  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;



  constructor(private http: HttpClient,
              private router: Router,
              private _snackBar: MatSnackBar,
              private userService: UserService) {
    //проверка при загрузке страницы на то, что пользователь залогинен
    // Знак !! приводит выражение к типу boolean
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  //Проверка пользователя на то зарегистрирован он или нет
  checkUserLogged() {
    this.getIsLoggedIn() ?
      (
        this.router.navigate(['/']),
          this._snackBar.open('Для доступа Вам необходимо выйти!')
      ) : false;
  }



  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    });
  }


  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name, email, password
    });
  }

  //Функция отправки запроса на разлогинивание
  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      });
    }
    //Генерируем ошибку при отсутствии рефреш токена в localstorage
    throw throwError(() => 'Can not find token');
  }

  //Функция для отправки рефрештокена при обработке ошибки 401 при работе с Избранным
  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      });
    }
    throw throwError(() => 'Can not use token');
  }

  //Метод для получения boolean информации о том залогинен пользователь или нет.
  public getIsLoggedIn() {
    return this.isLogged;
  }

  //Метод установки токенов в localstorage
  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  //Метод удаления токенов из localstorage
  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  //Метод для получения значения токена из localstorage
  public getTokens(): TokensType {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    }
  }

  //Создаем геттер и сеттер для установки и получения UserId

  get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: null | string)  {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      //если мы присваиваем в userId значение null, то произойдет удаление его из localstorage
      localStorage.removeItem(this.userIdKey);
    }
  }
}
