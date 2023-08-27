import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment.development";
import {UserInfoType} from "../../../types/user-info.type";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userName: string = 'userName';

  constructor(private http: HttpClient) { }

//Метод для отправки запроса на получение имени пользователя при регистрации.
  getUserName(authToken: string): Observable<DefaultResponseType | UserInfoType> {
    return this.http.get<DefaultResponseType | UserInfoType>(environment.api + 'users');
  }

  //Метод установки имени пользователя в localstorage
  public setName(userName: string): void {
    localStorage.setItem(this.userName, userName);
  }

  //Метод получения имени пользователя из localstorage
  public getName(): null | string {
    return localStorage.getItem(this.userName);
  }

  //Метод удаления имени пользователя из localstorage
  public removeName() {
    localStorage.removeItem(this.userName);
  }

}
