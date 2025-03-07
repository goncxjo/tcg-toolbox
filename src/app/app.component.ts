import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ResolveEnd, ResolveStart, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { LoaderService } from './core';
import { filter, map } from 'rxjs';
import { LoadingScreenComponent } from './layout/loading-screen/loading-screen.component';

// Ag-Grid-Angular: Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LoadingScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tcg-price-calc';

  constructor(
    private router: Router,
    private loaderService: LoaderService
  ) { }

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
        case '/home':
          document.body.className = 'home-background-color';          
          break;
        default:
          document.body.className = 'home-background-color-light';
          break;
      }
    });
  }
}
