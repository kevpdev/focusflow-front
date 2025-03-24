import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}

  /**
   * Generates a unique identifier (UUID).
   * @returns A string representing a UUID.
   */
  private generateUuId(): string {
    return crypto.randomUUID();
  }

  /**
   * Generates a temporary identifier.
   * This identifier is prefixed with "temp-" and is based on a UUID.
   * @returns A string representing the temporary ID.
   */
  public generateTempId(): string {
    const uuid = this.generateUuId();
    return `temp-${uuid}`;
  }

  /**
   * Retrieves the key of an enum type based on a given value.
   * If the value does not exist in the enum, a default key is returned.
   * @template T The type of the enum.
   * @param enumType The enum to search in.
   * @param value The value to match in the enum.
   * @param defaultKeyResponse The default key to return if no match is found.
   * @returns The key of the enum corresponding to the value, or the default key if no match is found.
   */
  public getEnumKeyFromValue<T extends Object>(
    enumType: T,
    value: string,
    defaultKeyResponse: keyof T
  ): keyof T {
    const key = Object.keys(enumType).find(key => enumType[key as keyof T] === value);
    if (!key) {
      return defaultKeyResponse;
    }
    return key as keyof T;
  }
}
