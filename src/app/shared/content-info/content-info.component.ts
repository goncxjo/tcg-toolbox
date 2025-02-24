import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-content-info',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './content-info.component.html',
  styleUrl: './content-info.component.scss'
})
export class ContentInfoComponent {
  @Input() title: string = '';
  @Input() htmlText: string = '';
  infoIcon = faInfoCircle;
}
