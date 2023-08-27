import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import {RouterModule} from "@angular/router";
import {DescriptionPipe} from "./pipes/description.pipe";
import { TitlePipe } from './pipes/title.pipe';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { LoaderComponent } from './components/loader/loader.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    ArticleCardComponent,
    DescriptionPipe,
    TitlePipe,
    CommentCardComponent,
    LoaderComponent,
  ],
  exports: [
    ArticleCardComponent,
    DescriptionPipe,
    TitlePipe,
    CommentCardComponent,
    LoaderComponent
    ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    RouterModule,
  ]
})
export class SharedModule { }
