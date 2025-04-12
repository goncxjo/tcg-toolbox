import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Tool, ToolTypes } from '../../backend';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  private tools: Tool[] = [
    { path: ToolTypes.NOT_SELECTED, title: '', description: '' },
    { path: ToolTypes.PRICE_CALCULATOR, title: 'Price Calculator', description: 'Con esta herramienta podés calcular precios de cartas TCG y verlas en distintas monedas.' }
  ];
  private tool: WritableSignal<Tool> = signal(this.tools[0]);

  set(toolName: string) {
    const tool = _.find(this.tools, (t: Tool) => t.path == toolName);
    if (tool) {
      this.tool.set(tool);
    } else {
      console.error('Error: tool not found')
    }
  }

  clean() {
    this.tool.set(this.tools[0]);
  }

  getTools() {
    return this.tools.filter(t => t.path !== '');
  }

  getSelectedTool() {
    return this.tool();
  }

  getSelectedToolPath() {
    return this.tool().path;
  }

  isPriceCalculator() {
    return this.tool().path == ToolTypes.PRICE_CALCULATOR;
  }
}