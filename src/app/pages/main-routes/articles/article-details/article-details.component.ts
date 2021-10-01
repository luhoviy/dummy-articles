import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../shared/models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss'],
})
export class ArticleDetailsComponent implements OnInit {
  article: Article;

  constructor(private activateRoute: ActivatedRoute) {
    this.activateRoute.data
      .pipe(take(1))
      .subscribe((data) => (this.article = data.article));
  }

  ngOnInit(): void {}
}
