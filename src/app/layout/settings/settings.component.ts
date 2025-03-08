import { Component, Inject, inject } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { NgbActiveOffcanvas, NgbOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { AppThemeService } from '../../core/services/app-theme.service';
import { faBars, faCircleUser, faMoon, faSun, faTimes } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FontAwesomeModule, NgbOffcanvasModule, LogoComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
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
  activeOffcanvas: NgbActiveOffcanvas = inject(NgbActiveOffcanvas);

  constructor(
    @Inject('APP_VERSION') appVersion: string,
    private userService: UserService
  ) {
    this.appVersion = appVersion;
  }

  ngOnInit(): void {
    this.theme = this.getTheme();
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
}
