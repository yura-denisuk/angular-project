import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {CurrentArticleType} from "../../../../types/current-article.type";
import {CommentsType} from "../../../../types/comments.type";
import {environment} from "../../../../environments/environment.development";
import {CommentService} from "../../../shared/services/comment.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MoreArticlesType} from "../../../../types/more-articles.type";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {

  currentArticle: CurrentArticleType;
  comments: CommentsType[] = [];
  relatedArticles: ArticleType[] = [];
  serverStaticPath = environment.serverStaticPath;
  commentText: string = '';
  isShowCommentMore: boolean = true;
  numCommentsAdded: number = 10;
  offset: number = 3;
  isLoggedIn: boolean = false;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar,
              private commentService: CommentService,
              private authService: AuthService,
              private articleService: ArticleService) {
    this.currentArticle = {
      text: '',
      comments: [],
      commentsCount: 0,
      id: '',
      title: '',
      description: '',
      image: '',
      date: '',
      category: '',
      url: ''
    }
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.getIsLoggedIn();

    //Получение сопровождающих статей
    this.activatedRoute.params.subscribe(params => {

      this.articleService.getRelatedArticles(params['url'])
        .subscribe({
          next: (data: ArticleType[]) => {
            this.relatedArticles = data
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка получения сопровождающих статей!')
            }
          }
        })
    })

    //Получение основной статьи страницы
    this.initArticleAndNewComment();
  }

  addComment() {
    this.commentService.addComment(this.commentText, this.currentArticle.id)
      .subscribe({
          next: (result: DefaultResponseType) => {
            if (result && !result.error) {
              this._snackBar.open(result.message);
            }
            this.initArticleAndNewComment();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка добавления нового комментария!')
            }
          }
        })
  }

  //Получение статьи и комментариев при открытии страницы и написании нового комментария
  initArticleAndNewComment() {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getCurrentArticle(params['url'])
        .subscribe({
          next: (data: CurrentArticleType) => {
            this.currentArticle = data;
            this.comments = data.comments;
            if (data.commentsCount <= 3) {
              this.isShowCommentMore = false;
            }
            this.commentService.getActionsForCurrentArticle(this.currentArticle.id)
              .subscribe({
                next: (data) => {
                  this.comments.forEach(comment => {
                    data.forEach(action => {
                      if (comment.id === action.comment) {
                        comment.isAction = action.action;
                      }
                    })
                  })
                },
                error: (errorResponse: HttpErrorResponse) => {
                  if (errorResponse.error && errorResponse.error.message) {
                    this._snackBar.open(errorResponse.error.message);
                  } else {
                    this._snackBar.open('Ошибка получения реакций для комментариев!')
                  }
                }
              });
            if (this.currentArticle.commentsCount < 3) {
              this.isShowCommentMore = false;
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Сервер временно не доступен!')
            }
          }
        })
    })
  }

  //Получение комментариев при нажатии на кнопку "Загрузить еще комментарии"
  showCommentMore() {
    this.commentService.addCommentMore({
      offset: this.offset,
      article: this.currentArticle.id
    }).subscribe({
        next: (data: MoreArticlesType) => {
          data.comments.forEach(comment => {
            this.comments.push(comment);
          })
          this.offset = this.offset + this.numCommentsAdded;
          if (this.offset >= this.currentArticle.commentsCount) {
            this.isShowCommentMore = false;
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка получения комментариев!')
          }
        }
      })
  }
}
