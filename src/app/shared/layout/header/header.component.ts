  import {Component, DoCheck, OnInit} from '@angular/core';
  import {AuthService} from "../../../core/auth/auth.service";
  import {MatSnackBar} from "@angular/material/snack-bar";
  import {NavigationEnd, Router} from "@angular/router";
  import {UserService} from "../../services/user.service";


  @Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
  })
  export class HeaderComponent implements OnInit, DoCheck{

    isLogged: boolean = false;
    userName: string = '';
    activeLink:string = '';

    constructor(private authService: AuthService,
                private userService: UserService,
                private _snackBar: MatSnackBar,
                private router: Router) {
      this.isLogged = this.authService.getIsLoggedIn();

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.activeLink = this.router.parseUrl(this.router.url).fragment || '';
        }
      })
    }

    ngOnInit() {
      //Получение актуального состояния авторизации пользователя при нахождении пользователя на странице
      this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
        this.isLogged = isLoggedIn;
      })
    }

    ngDoCheck() {
      //Получение имени пользователя для установки в header
      this.getUserNameFromLocalStorage();
    }

    logout() {
      this.authService.logout()
        .subscribe({
          next: () => {
            this.doLogout();
          },
          error: () => {
            this.doLogout();
          }
        })
    }

    //Функция набора действий при выходе пользователя из системы
    doLogout(): void {
      this.authService.removeTokens();
      this.userService.removeName();
      //удаление userId путем установки туда значения null
      this.authService.userId = null;
      this._snackBar.open('Вы успешно вышли из системы');
      this.router.navigate(['/']);
    }

    getUserNameFromLocalStorage() {
      const name = this.userService.getName();
      if (name) {
        this.userName = name;
      }
    }

  }
