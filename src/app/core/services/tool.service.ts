import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Tool } from '../../backend';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  readonly tools: Tool[] = [
    { id: 'price-calc', name: 'Price Calculator' }
  ];

  private tool: WritableSignal<Tool> = signal(this.tools[0]);

}