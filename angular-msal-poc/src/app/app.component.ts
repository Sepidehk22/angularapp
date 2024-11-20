import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{ title }}</h1>
    <button (click)="changeTitle()">Change Title</button>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'angular-msal-poc';

  changeTitle(): void {
    this.title = 'New Title';
  }
}