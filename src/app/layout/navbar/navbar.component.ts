import { Component, Inject, OnInit } from '@angular/core';
import { NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public isMenuCollapsed = true;
  public appVersion: string = '';
  public isLoading: boolean = false;
  public closeResult: string = '';

  constructor(
    @Inject('APP_VERSION') appVersion: string,
    private offcanvasService: NgbOffcanvas
  ) {
    this.appVersion = appVersion;
  }

  ngOnInit(): void {
  }

  getVersionText() {
    return `v${this.appVersion}`
  }

	open(content: any) {
    this.isMenuCollapsed = !this.isMenuCollapsed;
		this.offcanvasService.open(content, { position: 'end', panelClass: 'bg-primary text-bg-dark' }).result.then(
			(result) => {
        this.isMenuCollapsed = !this.isMenuCollapsed;
			},
			(reason) => {
			},
		);
	}
}
