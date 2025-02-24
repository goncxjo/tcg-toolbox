import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppThemeService {
  readonly theme = signal<string>(
    JSON.parse(localStorage.getItem('app-theme') ?? 'null')
  )
  constructor(@Inject(DOCUMENT) private document: Document) {
    effect(() => {
      localStorage.setItem('app-theme', JSON.stringify(this.theme()));
      const body = this.document.body as HTMLElement;
      body.setAttribute('data-bs-theme', this.theme())
    })
  }

  update(theme: string) {
    this.theme.set(theme);
  }
}
