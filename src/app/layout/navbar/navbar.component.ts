import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faMoon, faSearch, faSun } from '@fortawesome/free-solid-svg-icons';
import { NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { LogoComponent } from '../logo/logo.component';
import { CommonModule } from '@angular/common';
import { CardSearchService } from '../../core';
import { UserService } from '../../core/services/user.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { Router } from '@angular/router';
import { AppThemeService } from '../../core/services/app-theme.service';
import _ from 'lodash';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LogoComponent, CommonModule, FontAwesomeModule, NgbModalModule, NgbPopoverModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  searchIcon = faSearch;
  menuIcon = faBars;

  readonly defaultTheme = {
    name: 'light',
    label: 'Claro',
    icon: faSun
  };
  theme = this.defaultTheme;

  availableThemes = {
    light: this.defaultTheme,
    dark: { name: 'dark', icon: faMoon, label: 'Oscuro'}
  }

  constructor(
    private cardSearchService: CardSearchService,
    private userService: UserService,
    private sidebarService: SidebarService,
    private appThemeService: AppThemeService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.theme = this.getTheme();
  }
  
  openCardSearchModal() {
    this.cardSearchService.openCardSearchModal();
  }

	toggleSidebar() {
    this.sidebarService.toggle();
	}

  getAvatar() {
    return this.userService.avatar();
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  login() {
    this.userService.loginWithGoogle();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/home']);
  }

  toggleTheme() {
    if (this.isDarkTheme(this.theme)) {
      this.theme = this.availableThemes.light;
      }
      else {
      this.theme = this.availableThemes.dark;
    }
    this.appThemeService.update(this.theme.name)
  }

  getTheme() {
    const theme = _.find(this.availableThemes, ['name', this.appThemeService.theme()]);
    return theme ?? this.defaultTheme;
  }

  isDarkTheme(theme: any) {
    return this.availableThemes.dark == theme;
  }
}
