import {Component, Input, OnInit} from '@angular/core';
import {CommentsType} from "../../../../types/comments.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentService} from "../../services/comment.service";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {ActionCommentType} from "../../../../types/action-comment.type";

@Component({
  selector: 'comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent implements OnInit {
  @Input() comment!: CommentsType;
  likeActive: boolean = false;
  dislikeActive: boolean = false;
  actionBefore: string = '';
  ActionCommentTypeLike: ActionCommentType = ActionCommentType.like;
  ActionCommentTypeDislike: ActionCommentType = ActionCommentType.dislike;
  ActionCommentTypeViolate: ActionCommentType = ActionCommentType.violate;


  constructor(private _snackBar: MatSnackBar,
              private router: Router,
              private commentService: CommentService,) {

  }

  ngOnInit() {
    this.commentService.getActionForComment(this.comment.id)
      .subscribe(data => {
        if (data && data.length > 0) {
          if (data[0].action === this.ActionCommentTypeLike) {
            this.likeActive = true;
            this.dislikeActive = false;
            this.actionBefore = data[0].action;
          }
          if (data[0].action === this.ActionCommentTypeDislike) {
            this.likeActive = false;
            this.dislikeActive = true;
            this.actionBefore = data[0].action;
          }
        }
      })
  }

  //Добавление лайка или дизлайка
  commentActionResponse(id: string, action: string) {
    if (action === this.ActionCommentTypeViolate) {
      this.commentService.commentActionResponse(id, action)
        .subscribe({
            next: (data) => {
              if (!data.error) {
                this._snackBar.open('Жалоба отправлена!');
                return;
              }
            },
            error: () => {
              this._snackBar.open('Жалоба уже отправлена!')
            }
          });
    } else {
      this.commentService.commentActionResponse(id, action)
        .subscribe(
          {
            next: (data: DefaultResponseType) => {
              if (data && !data.error) {
                if (action === this.ActionCommentTypeLike && this.actionBefore === this.ActionCommentTypeLike) {
                  this.dislikeActive = false;
                  this.likeActive = !this.likeActive;
                  this.actionBefore = '';
                  this.comment.likesCount--;
                  this._snackBar.open('Ваш голос учтен');
                  return;
                }
                if (action === this.ActionCommentTypeLike && this.actionBefore === this.ActionCommentTypeDislike) {
                  this.dislikeActive = false;
                  this.likeActive = !this.likeActive;
                  this.actionBefore = this.ActionCommentTypeLike;
                  this.comment.likesCount++;
                  this.comment.dislikesCount--;
                  this._snackBar.open('Ваш голос учтен');
                  return;
                }
                if (action === this.ActionCommentTypeLike && this.actionBefore === '') {
                  this.dislikeActive = false;
                  this.likeActive = !this.likeActive;
                  this.actionBefore = this.ActionCommentTypeLike;
                  this.comment.likesCount++;
                  this._snackBar.open('Ваш голос учтен');
                  return;
                }

                if (action === this.ActionCommentTypeDislike && this.actionBefore === this.ActionCommentTypeDislike) {
                  this.likeActive = false;
                  this.dislikeActive = !this.dislikeActive;
                  this.actionBefore = '';
                  this.comment.dislikesCount--;
                  this._snackBar.open('Ваш голос учтен');
                  return;
                }
                if (action === this.ActionCommentTypeDislike && this.actionBefore === this.ActionCommentTypeLike) {
                  this.likeActive = false;
                  this.dislikeActive = !this.dislikeActive;
                  this.actionBefore = this.ActionCommentTypeDislike;
                  this.comment.dislikesCount++;
                  this.comment.likesCount--;
                  this._snackBar.open('Ваш голос учтен');
                  return;
                }
                if (action === this.ActionCommentTypeDislike && this.actionBefore === '') {
                  this.likeActive = false;
                  this.dislikeActive = !this.dislikeActive;
                  this.actionBefore = this.ActionCommentTypeDislike;
                  this.comment.dislikesCount++;
                  this._snackBar.open('Ваш голос учтен');
                  return;
                }
              }
            },
            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error && errorResponse.error.message) {
                this._snackBar.open(errorResponse.error.message);
              } else {
                this._snackBar.open('Ошибка добавления реакции пользователя!')
              }
            }
        })
    }
  }
}
