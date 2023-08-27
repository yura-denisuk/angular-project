import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {OrderService} from "../../../shared/services/order.service";
import {CategoryType} from "../../../../types/category.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {AppliedFilterType} from "../../../../types/applied-filter.type";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articles: ArticleType[] = [];
  categories: CategoryType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType [] = [];
  pages: number[] = [];

  openFilter: boolean = false;



  constructor(private articleService: ArticleService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private orderService: OrderService) {
  }

  ngOnInit() {

    //Метод подписки на квери-параметры (subscribe queryParams)
    this.orderService.getCategoryServices()
      .subscribe(data => {
        this.categories = data;

        //Подписка на query параметры при перезагрузке страницы для правильного отображения блока фильтра
        //Подписка на query параметры при перезагрузке страницы для правильного отображения строк выбранных фильтров
        this.activatedRoute.queryParams.subscribe(params => {
          this.activeParams = ActiveParamsUtil.processParams(params);

          //Код для открытия фильтра при перезагрузке
          // (this.activeParams.types && this.activeParams.types.length > 0) ?
          //   this.openFilter = true : this.openFilter = false;

          this.appliedFilters = [];
          this.activeParams.categories.forEach(url => {
            for (let i: number = 0; i < this.categories.length; i++) {
              if (this.categories[i].url === url) {
                this.appliedFilters.push(this.categories[i]);
              }
            }
          })

          //Отправка запроса на получение статей после настройки фильтрации
          //Получение всех статей для отображения на странице
          this.articleService.getArticles(this.activeParams)
            .subscribe(data => {
              this.pages = [];
              for (let i = 1; i <= data.pages; i++) {
                this.pages.push(i);
              }
              this.articles = data.items;
              this.activeParams.page
            })
        });
      })
  }

  toggleFilter() {
    this.openFilter = !this.openFilter;
  }

  updateFilterParam(url: string) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingTypeInParam = this.activeParams.categories.find(item => item === url);
      if (existingTypeInParam) {
        //Убираем параметр фильтра из activeParams
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingTypeInParam) {
        // this.activeParams.types.push(url);
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else {
      //Добавление в массив activeParams типа первого чекнутого параметра фильтра
      this.activeParams.categories = [url];
    }
    //Сбрасываем номер страницы в начало на 1 при изменении параметров фильтра
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  //Удаление выбранных фильтров над каталогом
  removeAplliedFilter(appliedFilter: string) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter);
    //Сбрасываем номер страницы в начало на 1 при изменении параметров фильтра
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  };

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      //Увеличиваем номер страницы на 1 и переходим на ту же страницу с теми же квери-параметрами
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }
  };

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      //Уменьшаем номер страницы на 1 и переходим на ту же страницу с теми же квери-параметрами
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }
  };


}
