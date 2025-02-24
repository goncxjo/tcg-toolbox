import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { LoaderService } from './backend/services/loader.service';
import { NavbarComponent } from './layout/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string = 'Cargando...';
  // @ViewChild('httpLoader') httpLoader!: ElementRef;
  @ViewChild('navbar') navbar!: NavbarComponent;

  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    private meta: Meta
    ) {
  }

  ngAfterViewInit() {
    // const httpLoader = this.httpLoader.nativeElement;
    this.loaderService.httpProgress().subscribe((status: boolean) => {
      if (status) {
        // this.renderer.removeClass(httpLoader, 'd-none');
        this.navbar.isLoading = true;
      } else {
        // this.renderer.addClass(httpLoader, 'd-none');
        this.navbar.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.updateMetaTags();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let title: string | null = null;
        let showPageTitle = true;

        let child = this.activatedRoute.firstChild;
        while (child?.firstChild) {
          child = child.firstChild;
        }
        if (child?.snapshot.data['title']) {
          title = child.snapshot.data['title'];
        }
        if (child?.snapshot.data['pageTitleHidden']) {
          showPageTitle = !child.snapshot.data['pageTitleHidden'];
        }
        return { title, showPageTitle };
      }),
    ).subscribe((cfg) => this.setTitle(cfg));
  }

  updateMetaTags() {
    const url = `${window.location.protocol}//${window.location.hostname}`;
    this.meta.updateTag({property: 'og:url', content: `${url}`})
    this.meta.updateTag({property: 'twitter:url', content: `${url}`})
  }

  private setTitle(cfg: any) {
    this.title = cfg.showPageTitle ? cfg.title : '';
    this.titleService.setTitle('Price Calculator' + (cfg.title ? ' - ' + cfg.title : ''));
  }
}
