import { Component, inject } from '@angular/core';
import { LoaderService } from '../../core';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [],
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.scss'
})
export class LoadingScreenComponent {
  loaderService = inject(LoaderService)

  isLoading() {
    return this.loaderService.isLoading();
  }
}
