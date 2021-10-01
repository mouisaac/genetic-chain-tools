import { Component } from '@angular/core';
import { domain } from './_shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'spirals';
  domain = domain;
  constructor(
  ) {
  }
}
