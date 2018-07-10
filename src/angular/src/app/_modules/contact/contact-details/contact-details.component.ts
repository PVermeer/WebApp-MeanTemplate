import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styles: [`

  #contact-details {
    max-width: 320px;
  }
  .social-buttons {
    font-size: 50px;
  }
  .image {
  }
  .title {
    padding: 0;
    margin: 0;
    letter-spacing: 1px;
  }
  .text {
    font-weight: 400;
  }
  `]
})
export class ContactDetailsComponent {

  // Life cycle
  constructor( ) { }

}
