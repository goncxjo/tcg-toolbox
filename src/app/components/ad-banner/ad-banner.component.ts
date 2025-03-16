import { Component } from '@angular/core';

@Component({
  selector: 'app-ad-banner',
  imports: [],
  templateUrl: './ad-banner.component.html',
  styleUrl: './ad-banner.component.scss'
})
export class AdBannerComponent {
  ads: any[] = [
    { id: 'rancho-store', url: 'https://ranchopokemon.com/tienda/', img: 'assets/rancho-store.gif'}
  ]
}
