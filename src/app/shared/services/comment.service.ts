import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {DefaultResponseType} from "../../../types/default-response.type";
import {MoreArticlesType} from "../../../types/more-articles.type";
import {AllActionsCommentsType} from "../../../types/all-actions-comments.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text, article
    });
  }

  //Просмотр большего количества комментариев при нажатии на кнопку загрузить больше комментариев (или как-то так)
  addCommentMore(params: {offset: number, article: string}): Observable<MoreArticlesType> {
    return this.http.get<MoreArticlesType>(environment.api + 'comments', {
      params: params
    });
  }

  //Получение всех реакций пользователя для комментариев текущей статьи на странице
  getActionsForCurrentArticle(id: string): Observable<AllActionsCommentsType[]> {
    return this.http.get<AllActionsCommentsType[]>(environment.api + 'comments/article-comment-actions?articleId=' + id);
  }

  //Получение изменения реакции пользователя для конкретного комментария текущей статьи на странице
  getActionForComment(id: string): Observable<AllActionsCommentsType[]> {
    return this.http.get<AllActionsCommentsType[]>(environment.api + 'comments/' + id + '/actions');
  }

  //Like / Dislike
  commentActionResponse(id: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', {
      action: action
    });
  }
}
