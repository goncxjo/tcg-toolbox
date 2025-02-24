import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Ag-Grid-Angular: Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tcg-price-calc';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.events.subscribe(value => {
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
