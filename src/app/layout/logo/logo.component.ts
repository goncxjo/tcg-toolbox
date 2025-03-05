import { Component, Input, inject } from '@angular/core';
import { LoaderService } from '../../core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {
  @Input() showTitle: boolean = true;
  @Input() preventRedirect: boolean = false;

  loaderService: LoaderService = inject(LoaderService);

  constructor(
    private router: Router 
  ) { }

  goHome() {
    if (!this.preventRedirect) {
      this.router.navigate(['home'])
    }
  }
}
