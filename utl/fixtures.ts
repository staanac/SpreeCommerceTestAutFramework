// fixtures/loginFixture.ts
import { test as base } from '@playwright/test';
import { SignInPage } from '../page-objects/signInPage';
import { MainPage } from '../page-objects/mainPage';
import { MyAccountPage } from '../page-objects/myAccountPage';
import { AssertionsHelper } from '../utl/assertionsHelper';
import { testData } from './testData';

type LoginFixture = {
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

export const test = base.extend<LoginFixture>({
  login: async ({ page }, use) => {
    const signInPage = new SignInPage(page);
    const mainPage = new MainPage(page);
    const { existingUserAccountWithCorrectCredentials } = testData;

    await page.goto('/')
    await mainPage.navigatingToLoginPage();
    await signInPage.populateSignInPage(existingUserAccountWithCorrectCredentials.username, existingUserAccountWithCorrectCredentials.password);

    await use(() => Promise.resolve()); // Provide login hook
  },

  logout: async ({ page }, use) => {
    await use(async () => {
      const mainPage = new MainPage(page);
      const myAccountPage = new MyAccountPage(page);

      await mainPage.navigatingToMyAccountPage();
      await myAccountPage.logout();
      
      // Assertion: To ensure that the user was signed out successfully 
      await AssertionsHelper.verifyDetailVisible(
        page.getByText('Signed out successfully.')
      );
    });
  },
});

export { expect } from '@playwright/test';
