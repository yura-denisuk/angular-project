import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../../../shared/services/user.service";
import {TokensType} from "../../../../types/tokens.type";
import {UserInfoType} from "../../../../types/user-info.type";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private _snackBar: MatSnackBar,
              private router: Router) {
    this.authService.checkUserLogged();
  }

  signupForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern('^(?:[А-ЯЁ][а-яё]*\\s*)*')]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    agree: [false, Validators.requiredTrue],
  });

  signup() {
    if (this.signupForm.valid && this.signupForm.value.email
      && this.signupForm.value.password && this.signupForm.value.firstName
      && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.firstName, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            const loginResponse: LoginResponseType = data as LoginResponseType;
            if (!loginResponse.accessToken ||!loginResponse.refreshToken ||!loginResponse.userId) {
              error = 'Ошибка авторизации';
            }
            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this.getUserName();
            this._snackBar.open('Вы успешно зарегистрировались');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка регистрации');
            }
          }
        })
    }
  }

  getUserName() {
    const tokens: TokensType = this.authService.getTokens();
    if (tokens && tokens.accessToken) {
      const userName = this.userService.getUserName(tokens.accessToken)
        .subscribe({
          next: (data: DefaultResponseType | UserInfoType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            const userNameResponse: UserInfoType = data as UserInfoType;
            if (!userNameResponse.id || !userNameResponse.name || !userNameResponse.email) {
              error = 'Ошибка получения данных пользователя';
            }
            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.userService.setName(userNameResponse.name);
          },

          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка запроса данных пользователя');
            }
          }
        })
    }
  }
}
