import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Tool } from '../../backend';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  private tools: Tool[] = [
    { path: 'price-calc', title: 'Price Calculator', description: 'Con esta herramienta podés calcular precios de cartas TCG y verlas en distintas monedas.' }
  ];
  private tool: WritableSignal<Tool> = signal(this.tools[0]);

  set(toolName: string) {
    const tool = _.find(this.tools, (t: Tool) => t.path === toolName);
    if (tool) {
      this.tool.set(tool);
    }
    console.error('Error: tool not found')
  }

  getTools() {
    return this.tools;
  }

  getSelectedToolPath() {
    return this.tool().path;
  }
}