import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faCalculator, faGear, faHeart, faHome, faList, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgbModalModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from '../settings/settings.component';
import { LogoComponent } from '../logo/logo.component';
import { CommonModule } from '@angular/common';
import { AppThemeService } from '../../core/services/app-theme.service';
import { CardSearchService } from '../../core';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LogoComponent, CommonModule, FontAwesomeModule, RouterLink, RouterLinkActive, NgbModalModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  homeIcon = faHome;
  calcIcon = faCalculator;
  listIcon = faList;
  searchIcon = faSearch;
  favIcon = faHeart;
  settingsIcon = faGear;
  menuIcon = faBars;

  public isMenuCollapsed = true;
  public appVersion: string = '';

  items: any[] = [
    { icon: this.homeIcon, command: () => { this.router.navigate(['/'])} },
    { icon: this.listIcon, command: () => { this.router.navigate(['/price-calc/card-lists'])} },
    { icon: this.searchIcon, command: () => { this.openCardSearchModal() } },
    { icon: this.favIcon, command: () => {} },
    { icon: this.settingsIcon, command: () => { this.openSettingsOffcanvas() } },
  ];

  appThemeService: AppThemeService = inject(AppThemeService);

  constructor(
    private offcanvasService: NgbOffcanvas,
    private router: Router,
    private cardSearchService: CardSearchService,
    private userService: UserService
  ) { }

  openCardSearchModal() {
    history.pushState(null, window.document.URL);
    this.cardSearchService.openCardSearchModal();
  }

	openSettingsOffcanvas() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
		this.offcanvasService.open(SettingsComponent, { panelClass: 'bg-primary text-bg-dark' }).result.then(
			(result) => {
        this.isMenuCollapsed = !this.isMenuCollapsed;
			},
			(reason) => {
			},
		);
	}

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  logout() {
    this.userService.logout();
  }
}
