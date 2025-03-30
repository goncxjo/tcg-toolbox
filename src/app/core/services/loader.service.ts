import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _isLoading: WritableSignal<boolean> = signal(false);

  get isLoading(): Signal<boolean> {
    return this._isLoading;
  }

  show(): void {
    this._isLoading.set(true);
  }

  hide(): void {
    this._isLoading.set(false);
  }
}