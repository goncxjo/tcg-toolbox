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

  loaderService: LoaderService = inject(LoaderService);

  constructor(
    private router: Router 
  ) { }

  goHome() {
    this.router.navigate(['home'])
  }
}
