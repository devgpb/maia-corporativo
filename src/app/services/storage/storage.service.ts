import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageSub = new BehaviorSubject<object>({});

  constructor() {
    window.addEventListener('storage', (event) => this.storageEventListener(event));
  }

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, value);
    this.storageSub.next({ key, value });
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
    this.storageSub.next({ key });
  }

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      const value = event.newValue ? JSON.parse(event.newValue) : {};
      this.storageSub.next({ key: event.key, value: value });
    }
  }
}
