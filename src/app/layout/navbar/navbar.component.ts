import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { LogoComponent } from '../logo/logo.component';
import { CommonModule } from '@angular/common';
import { CardSearchService } from '../../core';
import { UserService } from '../../core/services/user.service';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LogoComponent, CommonModule, FontAwesomeModule, NgbModalModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  searchIcon = faSearch;
  menuIcon = faBars;

  public isMenuCollapsed = true;
  public appVersion: string = '';

  sidebarService: SidebarService = inject(SidebarService);

  constructor(
    private cardSearchService: CardSearchService,
    private userService: UserService
  ) { }

  openCardSearchModal() {
    history.pushState(null, window.document.URL);
    this.cardSearchService.openCardSearchModal();
  }

	toggleSidebar() {
    this.sidebarService.toggle();
	}

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  logout() {
    this.userService.logout();
  }
}
