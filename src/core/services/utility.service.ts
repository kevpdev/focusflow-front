import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  private generateUuId(): string {
    return crypto.randomUUID();
  }

  public generateTempId(): string {
    const uuid = this.generateUuId();
    return `temp-${uuid}`;
  }
}
