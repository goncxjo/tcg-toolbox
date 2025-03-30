import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-content-info',
  standalone: true,
  imports: [FontAwesomeModule, NgbCollapseModule],
  templateUrl: './content-info.component.html',
  styleUrl: './content-info.component.scss'
})
export class ContentInfoComponent {
  title = input<string>('');
  htmlText = input<string>('');
  infoIcon = faInfoCircle;
  closeIcon = faTimes;

  isCollapsed: boolean = false;
}
