import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styles: [ require('./app.style.scss')],
  template: '<router-outlet></router-outlet>'
})
export class App {
  constructor() {}
}
