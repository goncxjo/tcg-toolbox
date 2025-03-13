import { Component, effect, HostListener } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ResolveEnd, ResolveStart, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { LoaderService } from './core';
import { filter, map } from 'rxjs';
import { LoadingScreenComponent } from './layout/loading-screen/loading-screen.component';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';
import { NgbCollapse, NgbCollapseModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SidebarService } from './core/services/sidebar.service';

// Ag-Grid-Angular: Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, LoadingScreenComponent, BreadcrumbComponent, BreadcrumbItemDirective, NgbCollapseModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tcg-toolbox';
  applyContainer: boolean = false;
  isSidebarCollapsed: boolean = false;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private sidebarService: SidebarService
  ) {
    effect(() => {
      this.isSidebarCollapsed = this.sidebarService.isCollapsed();
    })
  }


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

  ngAfterViewInit() {
    this.sidebarService.isCollapsed
  }
}
