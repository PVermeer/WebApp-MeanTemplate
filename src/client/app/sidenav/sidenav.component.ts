import { Component, ChangeDetectorRef, OnDestroy, ViewChild, ViewChildren, QueryList, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav, MatExpansionPanel, MatDialog, MatSlideToggle } from '@angular/material';

import { SidenavContent } from './sidenav.types';
import { SidenavService } from './sidenav.service';
import { routerTransition } from './sidenav-router.animation';
import { UserService } from '../_modules/users/user.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  providers: [MediaMatcher],
  animations: [routerTransition()]
})
export class SidenavComponent implements OnInit, OnDestroy {

  // Get elements
  @ViewChild('sidenav') private sidenav: MatSidenav;
  @ViewChild('expHomeNav') private expHomeNav: MatExpansionPanel;
  @ViewChildren('expRouteNav') private expRoutedNav: QueryList<MatExpansionPanel>;

  // Sidenav content
  public title = 'app';
  public pageNav: SidenavContent = [{
    title: 'Navigation',
    items: [
      { label: 'Home', path: 'home' },
      { label: 'About', path: 'about' },
      { label: 'Contact', path: 'contact' },
    ],
  }];

  // Variables
  public mobileQuery: MediaQueryList;
  public sidenavContent: SidenavContent;
  private _mobileQueryListener: () => void;
  public isLoggedIn = false;

  // Methods
  public tabChange() {
    // Scroll to top
    const element = document.getElementById('sidenav-content');
    element.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public scrollTo(element: string) { this.sidenavService.scrollIntoView(element); }

  public toggleTheme(event: MatSlideToggle) { this.sidenavService.passThemeToggle(event.checked); }

  public getState(outlet: RouterOutlet) { return outlet.activatedRouteData.state; }

  public login() { this.userService.login(); }

  public logout() { this.userService.logout(); }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private sidenavService: SidenavService,
    public matDialog: MatDialog,
    private userService: UserService,
  ) {
    // Sidenav mobile support
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    // Change sidenav content based on route
    this.sideNavContentChange();

    // Toggle sidenav based on route
    this.toggleSidenav();
    this.toggleExpansions();

    // Subscribe to login status
    this.toggleIsLoggedIn();
  }

  ngOnInit() {
    // Check if user still has valid tokens
    this.userService.checkLogin();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  // ---------------------------------------------------------------------------

  // Constructor methods
  private sideNavContentChange() {
    this.sidenavService.sidenavContent$.subscribe(sidenavPassedContent => {
      this.sidenavContent = sidenavPassedContent;
      this.changeDetectorRef.detectChanges();
    });
  }

  private toggleSidenav() {
    this.sidenavService.sidenavToggle$.subscribe(sidenavToggle => {
      setTimeout(() => {
        switch (sidenavToggle) {
          case 'open': this.sidenav.open(); break;
          case 'close': this.sidenav.close(); break;
          case 'toggle': this.sidenav.toggle(); break;
          default: return;
        }
      }, 0);
    });
  }

  private toggleExpansions() {
    this.sidenavService.expansionToggle$.subscribe(expansionToggle => {
      setTimeout(() => {
        this.expHomeNav.close();
        if (expansionToggle === 'open') {
          this.expRoutedNav.forEach((child) => { child.open(); return; });
        }
        if (expansionToggle === 'close') {
          this.expRoutedNav.forEach((child) => { child.close(); return; });
        }
        if (expansionToggle === 'toggle') {
          this.expRoutedNav.forEach((child) => { child.toggle(); return; });
        }
        if (expansionToggle === 'home') {
          this.expHomeNav.open();
          return;
        }
      }, 0);
    });
  }

  private toggleIsLoggedIn() {
    this.userService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

}