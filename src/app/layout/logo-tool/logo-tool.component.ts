import { Component, inject } from '@angular/core';
import { Tool } from '../../backend';
import { ToolService } from '../../core';

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

  constructor() {
    this.tool = this.toolService.getSelectedTool();
  }
}
