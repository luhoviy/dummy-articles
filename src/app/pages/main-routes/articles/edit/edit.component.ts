import { Component, OnInit } from '@angular/core';
import { Article } from '../shared/models';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  article: Article;

  constructor(private activateRoute: ActivatedRoute) {
    this.activateRoute.data
      .pipe(take(1))
      .subscribe((data) => (this.article = data.article));
  }

  ngOnInit(): void {}
}
