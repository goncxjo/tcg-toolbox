import { Component, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Component({
  selector: 'app-ad-banner',
  imports: [],
  templateUrl: './ad-banner.component.html',
  styleUrl: './ad-banner.component.scss',
  standalone: true
})
export class AdBannerComponent {
  ads: any[] = [
    { id: 'rancho-store', url: 'https://ranchostoretcg.com.ar/', img: 'assets/rancho-store.gif'}
  ]

  private analytics = inject(Analytics);
  
  onAdvertisingClick() {
    logEvent(this.analytics, 'ad_click');
  }
}
