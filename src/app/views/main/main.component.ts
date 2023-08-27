import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleService} from "../../shared/services/article.service";
import {ArticleType} from "../../../types/article.type";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrderService} from "../../shared/services/order.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {ServiceType} from "../../../types/service.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  articles: ArticleType[] = [];
  isShowPopup: boolean = false;
  isShowPopupOrderSuccess: boolean = false;

  constructor(private articleService: ArticleService,
              private orderService: OrderService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder,) {
  }

  ngOnInit() {
    this.articleService.getPopularArticles()
      .subscribe((data: ArticleType[]) => {
        this.articles = data;
      })
  }

  popupForm: FormGroup = this.fb.group({
    service: ['', Validators.required],
    firstName: ['', [Validators.required, Validators.pattern('^(?:[А-ЯЁ][а-яё]*\\s*)*')]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9][0-9]{7,14}$/)]],
  });

  showPopup(service: string | null) {
    if (service) {
      this.isShowPopup = true;
      this.popupForm.reset();
      this.popupForm.get('service')?.setValue(service);
    } else {
      this.popupForm.reset();
      this.isShowPopup = true;
    }
  }

  hidePopup() {
    this.isShowPopup = false;
  }

  hidePopupPopupOrderSuccess() {
    this.isShowPopupOrderSuccess = false;
  }

  orderForSuggestion() {
    this.order();
  }

  order() {
    this.orderService.doOrder(this.popupForm.value.firstName,
      this.popupForm.value.phone, this.popupForm.value.service, 'order')
      .subscribe({
        next: (data: DefaultResponseType) => {
          if (data.error) {
            this._snackBar.open(data.message);
            throw new Error(data.message)
          }

          this.isShowPopup = false;
          this.isShowPopupOrderSuccess = true;
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка оформления заказа');
          }
        }
      })
  }

  customOptionsSuggestion: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 0,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
    },
    nav: false
  };

  suggestions = [
    {
      name: 'Предложение месяца',
      title: 'Продвижение в Instagram для вашего бизнеса -15%!',
      service: 'Реклама',
      text: '',
      image: 'image-1.png',
    },
    {
      name: 'Акция',
      title: 'Нужен грамотный копирайтер?',
      service: 'Копирайтинг',
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
      image: 'image-2.png',
    },
    {
      name: 'Новость дня',
      title: '6 место в ТОП-10 SMM-агенств Москвы!',
      service: 'Продвижение',
      text: 'Мы благодарим каждого, кто голосовал за нас!',
      image: 'image-3.png',
    },
  ];

  services: ServiceType[] = [
    {
      image: 'service1.png',
      title: 'Создание сайтов',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7 500',
    },
    {
      image: 'service2.png',
      title: 'Продвижение',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3 500',
    },
    {
      image: 'service3.png',
      title: 'Реклама',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы. ',
      price: '1 000',
    },
    {
      image: 'service4.png',
      title: 'Копирайтинг',
      text: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750',
    },
  ];

  advantages = [
    {
      num: '1',
      span: 'Мастерски вовлекаем аудиториюв процесс. ',
      text: 'Мы увеличиваем процент вовлечённости за короткий промежуток времени.'
    },
    {
      num: '2',
      span: 'Разрабатываем бомбическую визуальную концепцию. ',
      text: 'Наши специалисты знают как создать уникальный образ вашего проекта.'
    },
    {
      num: '3',
      span: 'Создаём мощные воронки с помощью текстов. ',
      text: 'Наши копирайтеры создают не только вкусные текста, но и классные воронки.'
    },
    {
      num: '4',
      span: 'Помогаем продавать больше. ',
      text: 'Мы не только помогаем разработать стратегию по продажам, но также корректируем её под нужды заказчика.'
    },
  ];

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  }

  reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
  ]

}
