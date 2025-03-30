import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { LogoComponent } from '../logo/logo.component';
import { CommonModule } from '@angular/common';
import { CardSearchService } from '../../core';
import { UserService } from '../../core/services/user.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { Router } from '@angular/router';

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

  constructor(
    private cardSearchService: CardSearchService,
    private userService: UserService,
    private sidebarService: SidebarService,
    private router: Router,

  ) { }

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
}
