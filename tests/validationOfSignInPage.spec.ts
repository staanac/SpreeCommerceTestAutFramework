import { expect, test } from '@playwright/test';
import { SignInPage } from '../page-objects/signInPage';
import { MainPage } from '../page-objects/mainPage';
import { testData } from '../utl/testData';
import { AssertionsHelper } from '../utl/assertionsHelper';

let signInPage: SignInPage;

test.beforeEach(async ({ page }) => {
    // Page-objects
    const mainPage = new MainPage(page);
    signInPage = new SignInPage(page);

    // Launching the Spree Commerce page
    await page.goto('/');

    // Assertion: Ensure user was directed successfully to Spree Commerce landing page
    await AssertionsHelper.verifyDetailVisible(
        page.getByText('Welcome to this Spree Commerce demo website')
    );

    // Tapping the My Account button
    await mainPage.navigatingToLoginPage();

    // Assertion: Ensure user was directed login page
    await AssertionsHelper.verifyDetailVisible(
        page.getByRole('heading', { name: 'Login' })
    );
})

test('Validation where the user entered incorrect password', async ({ page }) => {
    // Variables:
    const { username, password } = testData.existingUserAccountWithIncorrectPassword;

    // Populating the Sign In page
    await signInPage.populateSignInPage(username, password);

    // Assertion: Ensure user was NOT successfully logged in
    await AssertionsHelper.verifyDetailVisible(
        page.getByText('Invalid email or password.')
    );
})

test('Validation where the user entered non-existing user', async ({ page }) => {
    // Variables:
    const { username, password } = testData.nonExistingUserAccount;

    // Populating the Sign In page
    await signInPage.populateSignInPage(username, password);

    // Assertion: Ensure user was NOT successfully logged in
    await AssertionsHelper.verifyDetailVisible(
        page.getByText('Invalid email or password.')
    );
})

test('Validation where the user entered existing user', async ({ page }) => {
    // Variables:
    const { username, password } = testData.existingUserAccountWithCorrectCredentials;

    // Populating the Sign In page
    await signInPage.populateSignInPage(username, password);

    // Assertion: Ensure user was signed in successfully 
    await AssertionsHelper.verifyDetailVisible(
        page.getByText('Signed in successfully.')
    );
})