import { computed, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private __isCollapsed__: WritableSignal<boolean> = signal<boolean>(false);
  public isCollapsed = computed(this.__isCollapsed__);

  toggle() {
    this.__isCollapsed__.set(!this.__isCollapsed__());
  }

  collapse() {
    this.__isCollapsed__.set(true);
  }

  expand() {
    this.__isCollapsed__.set(false);
  }
}
