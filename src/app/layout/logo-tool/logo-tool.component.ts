import { Component, inject } from '@angular/core';
import { Tool } from '../../backend';
import { ToolService } from '../../core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logo-tool',
  standalone: true,
  imports: [],
  templateUrl: './logo-tool.component.html',
  styleUrl: './logo-tool.component.scss'
})
export class LogoToolComponent {
  tool!: Tool | null;

  toolService = inject(ToolService);

  router = inject(Router);

  constructor() {
    this.tool = this.toolService.getSelectedTool();
  }

  onLogoClick() {
    if (!this.tool) {
      return;
    }
    this.router.navigate([`/${this.tool?.path}`]);
  }
}
