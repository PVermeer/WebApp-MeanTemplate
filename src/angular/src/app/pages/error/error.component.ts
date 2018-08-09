import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
  <div class="flex-column-around-center">
    <br><br>
    <h1>Whoops something went wrong</h1>
    <a #clickLink href="/"></a>
    <button mat-raised-button color="accent" (click)="clickLink.click()" class="cursor-pointer"> Reset the app </button>
  </div>
  `,
  styles: []
})
export class ErrorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
