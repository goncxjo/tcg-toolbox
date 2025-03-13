import { Component, Inject, inject } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { AppThemeService } from '../../core/services/app-theme.service';
import { faBars, faCircleUser, faMoon, faSun, faTimes } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserService } from '../../core/services/user.service';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FontAwesomeModule, LogoComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  closeIcon = faTimes;
  menuIcon = faBars;
  userIcon = faCircleUser;

  public appVersion: string = '';

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

  appThemeService: AppThemeService = inject(AppThemeService);
  sidebarService: SidebarService = inject(SidebarService);

  constructor(
    @Inject('APP_VERSION') appVersion: string,
    private userService: UserService
  ) {
    this.appVersion = appVersion;
  }

  ngOnInit(): void {
    this.theme = this.getTheme();
  }

  expand() {
    this.sidebarService.expand();
  }

  getUserName() {
    return this.userService.getUserName()
  }

  login() {
    this.userService.loginWithGoogle();
  }

  logout() {
    this.userService.logout();
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
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

  getVersionText() {
    return `v${this.appVersion}`
  }

  dismiss(reason: string) {
    
  }
}
