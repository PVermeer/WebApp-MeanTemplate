import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { auditTime } from 'rxjs/operators';
import { PagePathHighlightService } from './page-path-highlight.service';

@Directive({
  selector: '[appPagePathHighlight]'
})
export class PagePathHighlightDirective implements OnInit, OnDestroy {

  private contentDiv: HTMLElement;
  private subscriptions = new Subscription;

  @Input('appPagePathHighlight') appPagePathHighlight: string;
  @Input('className') className: string;

  public checkInView(): void {

    if (!this.appPagePathHighlight) { return; }

    const element = this.elementRef.nativeElement;
    element.classList.remove(this.className);

    const targetElement = document.getElementById(this.appPagePathHighlight);
    if (!targetElement) { return; }

    const targetElementRec: ClientRect = targetElement.getBoundingClientRect();
    const contentDivRec: ClientRect = this.contentDiv.getBoundingClientRect();

    const elementTop = targetElementRec.top - contentDivRec.top;
    const elementHeight = targetElementRec.height;
    const elementBottom = elementTop + elementHeight;
    const contentDivHeight = contentDivRec.height;

    const entry = () => {
      element.classList.add(this.className);
    };
    const leave = () => {
      element.classList.remove(this.className);
    };

    if (elementBottom > 0 || elementTop < contentDivHeight) {
      if (!this.pagePathHighlightService.isActive) { entry(); }
      this.pagePathHighlightService.isActive = true;
    }
    if (elementBottom < 0 || elementTop > contentDivHeight) {
      leave();
      this.pagePathHighlightService.isActive = false;
    }

  }

  // Lifecycle
  constructor(
    private elementRef: ElementRef,
    private pagePathHighlightService: PagePathHighlightService
  ) {
    this.contentDiv = document.getElementById('sidenav-content');
  }

  ngOnInit() {
    setTimeout(() => {
      this.checkInView();
    });

    const scroll = fromEvent(this.contentDiv, 'scroll').pipe(auditTime(500)).subscribe(() => this.checkInView());
    const resize = fromEvent(window, 'resize').pipe(auditTime(500)).subscribe(() => this.checkInView());

    this.subscriptions.add(scroll);
    this.subscriptions.add(resize);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
