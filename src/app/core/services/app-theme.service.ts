import { Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppThemeService {
  readonly theme = signal<string>(
    JSON.parse(localStorage.getItem('app-theme') ?? 'null')
  )
  constructor() {
    effect(() => {
      localStorage.setItem('app-theme', JSON.stringify(this.theme()));
      document.body.setAttribute('data-bs-theme', this.theme())
    })
  }

  update(theme: string) {
    this.theme.set(theme);
  }
}
