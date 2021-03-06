import { Component } from '@angular/core';
import { SidenavService } from './sidenav/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  // Variables
  public secondaryTheme: boolean;

  // Life cycle
  constructor(
    private sidenavService: SidenavService,
  ) {
    // Toggle theme for the entire app
    this.sidenavService.themeToggle$.subscribe((themeToggle) => {
        this.secondaryTheme = themeToggle;
    });
  }

}
