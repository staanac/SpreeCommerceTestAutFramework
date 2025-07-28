import { expect, Locator } from '@playwright/test';

export class AssertionsHelper {
  static extractNumber(value: string | null): number {
    if (!value) return 0;
    return parseFloat(value.replace(/[^\d.]/g, ''));
  }

  static async verifyTextContains(locator: Locator, expected: string) {
    const actual = await locator.textContent();
    expect(actual?.trim()).toContain(expected.trim());
  }

  static async verifyExactValue(locator: Locator, expected: string) {
    await expect(locator).toHaveValue(expected);
  }

  static async verifyNumberEquality(actualValue: string | null, expectedValue: string | null | number) {
    const actual = AssertionsHelper.extractNumber(actualValue);
    const expected = typeof expectedValue === 'number' ? expectedValue : AssertionsHelper.extractNumber(expectedValue);
    expect(actual).toEqual(expected);
  }

  static async verifyDetailVisibleByFilter(locator: Locator, value: string) {
    await expect(locator.filter({ hasText: value.trim() })).toBeVisible();
  }

  static async verifyProductColorVisible(locator: Locator, value: string) {
    await expect(locator.filter({ hasText: `Color: ${value.trim()}` })).toBeVisible();
  }

  static async verifyProductSizeVisible(locator: Locator, value: string) {
    await expect(locator.filter({ hasText: `Size: ${value.trim()}` })).toBeVisible();
  }

    static async verifyDetailVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }
}
