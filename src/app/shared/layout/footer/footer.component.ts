import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrderService} from "../../services/order.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  isShowPopup: boolean = false;
  isShowPopupOrderSuccess: boolean = false;

  constructor(private fb: FormBuilder,
              private orderService: OrderService,
              private router: Router,
              private _snackBar: MatSnackBar,) {
  }

  popupForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern('^(?:[А-ЯЁ][а-яё]*\\s*)*')]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9][0-9]{7,14}$/)]],
  });

  showPopup() {
      this.isShowPopup = true;
      this.popupForm.reset();
  }

  hidePopup() {
    this.isShowPopup = false;
  }

  hidePopupPopupOrderSuccess() {
    this.isShowPopupOrderSuccess = false;
  }

  orderForSuggestion() {
    this.router.navigate(['/']);
    this.isShowPopup = false;
    this._snackBar.open('Мы свяжемся с Вами в ближайшее время!');
    // this.order();
  }
}
