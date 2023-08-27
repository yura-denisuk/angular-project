import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment.development";
import {AllArticlesType} from "../../../types/all-articles.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {CurrentArticleType} from "../../../types/current-article.type";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient,
              private router: Router) { }

  getPopularArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getArticles(activeParams: ActiveParamsType): Observable<AllArticlesType> {
    return this.http.get<AllArticlesType>(environment.api + 'articles', {
      params: activeParams
    });
  }

  getRelatedArticles(articleName: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + articleName);
  }

  getCurrentArticle(articleName: string): Observable<CurrentArticleType> {
    return this.http.get<CurrentArticleType>(environment.api + 'articles/' + articleName);
  }

  navigateLink(url: string) {
    this.router.navigate([url])
  }


}
