import { Component, effect, HostListener } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ResolveEnd, ResolveStart, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { LoaderService } from './core';
import { distinctUntilChanged, filter, map, Subscription, tap } from 'rxjs';
import { LoadingScreenComponent } from './layout/loading-screen/loading-screen.component';
import { BreadcrumbComponent } from 'xng-breadcrumb';
import { NgbCollapseModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SidebarService } from './core/services/sidebar.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// Ag-Grid-Angular: Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, LoadingScreenComponent, BreadcrumbComponent, NgbCollapseModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tcg-toolbox';
  applyContainer: boolean = false;
  isSidebarCollapsed: boolean = false;
  bs!: Subscription;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private sidebarService: SidebarService,
    private breakpointObserver: BreakpointObserver
  ) {
    effect(() => {
      this.isSidebarCollapsed = this.sidebarService.isCollapsed();
    })
  }

  readonly breakpoint$: any;

  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event) {
    if (this.modalService.hasOpenModals()) {
      history.pushState(null, window.document.URL);
      this.modalService.dismissAll();
    } else {
      history.back();
    }
  }

  ngOnInit() {
    this.bs = this.breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.XSmall])
    .pipe(distinctUntilChanged()).subscribe(() => this.collapseIfSmallScreen());

    this.router.events.pipe(
      filter(
        (e) =>
          e instanceof NavigationStart ||
          e instanceof NavigationEnd ||
          e instanceof NavigationCancel ||
          e instanceof NavigationError ||
          e instanceof ResolveStart ||
          e instanceof ResolveEnd
      ),
      map((e) => e instanceof NavigationStart || e instanceof ResolveStart)
    ).subscribe(loading => {
      loading ? this.loaderService.show() : this.loaderService.hide();    
      this.collapseIfSmallScreen();  
      switch (this.router.url) {
        case '/':
        case '/home':
          document.body.className = 'home-background-color';
          // this.applyContainer = false
          break;
          default:
            document.body.className = 'home-background-color-light';
            // this.applyContainer = true
          break;
      }
    });
  }
  
  collapseIfSmallScreen(): void {
    if(this.breakpointObserver.isMatched(Breakpoints.Small) || this.breakpointObserver.isMatched(Breakpoints.XSmall)) {
      this.sidebarService.collapse();
    } else {
      this.sidebarService.expand();
    }
  }

  ngOnDestroy() {
    this.bs.unsubscribe()
  }
}

