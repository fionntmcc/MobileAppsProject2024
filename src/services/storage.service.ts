import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public async set(key: string, value: any) {
    let res = await this._storage?.set(key, value);
    console.log(res);
  }

  public async get(key: string) {
    return await this._storage?.get(key);
  }

  public async remove(key: string) {
    return await this.storage.remove(key);
  }

  public async keySet() {
    return await this.storage.keys();
  }

  public async clearDB() {
    return await this.storage.clear();
  }

}