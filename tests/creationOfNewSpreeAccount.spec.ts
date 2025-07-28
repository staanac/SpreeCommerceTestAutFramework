import { expect, test } from '@playwright/test';
import { SignUpPage } from '../page-objects/signUpPage';
import { MainPage } from '../page-objects/mainPage';
import { testData } from '../utl/testData';
import { AssertionsHelper } from '../utl/assertionsHelper';

let signUpPage: SignUpPage;

test.beforeEach(async ({ page }) => {
    // Variable
    const mainPage = new MainPage(page);
    signUpPage = new SignUpPage(page);

    // Launch the Spree Commerce page
    await page.goto('/');

    // Assertion: Ensure user was directed successfully to Spree Commerce landing page
    await AssertionsHelper.verifyDetailVisible(
        page.getByText('Welcome to this Spree Commerce demo website')
    );

    // Tap My Account button
    await mainPage.navigatingToLoginPage()

    // Assertion: Ensure user was directed login page
    await AssertionsHelper.verifyDetailVisible(
        page.getByRole('heading', { name: 'Login' })
    );

    // Tap 'Sign Up' link
    await mainPage.navigatingToSignUpPage()

    // Assertion: Ensur user was directed Sign Up page
    await AssertionsHelper.verifyDetailVisible(
        page.getByRole('heading', { name: 'Sign Up' })
    );
})

test('Validation where email address was already taken or existing in the record.', async ({ page }) => {
    // Variables:
    const { username, password } = testData.existingUserAccountWithCorrectCredentials;

    // Populating the Sign Up page
    await signUpPage.populateSignUpPage(username, password, password);

    // Assertion: To ensure that the user was not created
    await expect(page.getByText('Email has already been taken')).toBeVisible();
});

test('Validation where password is less than 6 characters', async ({ page }) => {
    const { username, password } = testData.newUserAccountWithInvalidPassword;
    // Populating the Sign Up page
    await signUpPage.populateSignUpPage(username, password, password);

    // Assertion: To ensure that the user was not created
    await AssertionsHelper.verifyDetailVisible(
        page.getByText('Password is too short (minimum is 6 characters)')
    );
});

test('Validation where password mismatched with password confirmation', async ({ page }) => {
    // Variables
    const { username, password, passwordConfirmation } = testData.newUserAccountWherePasswordMismatched;

    // Populating the Sign Up page
    const signUpPage = new SignUpPage(page);
    await signUpPage.populateSignUpPage(username, password, passwordConfirmation);

    // Assertion: To ensure that the user was not created
    await AssertionsHelper.verifyDetailVisible(
        page.getByText("Password Confirmation doesn't match Password")
    );
});

test('Validation where all the required fields were populated correctly', async ({ page }) => {
    const { username, password } = testData.newUserAccountWithValidCredential;
    // Populating the Sign Up page
    await signUpPage.populateSignUpPage(username, password,
        password);

    // Assertion: To ensure that the user was successfully created
    await AssertionsHelper.verifyDetailVisible(
        page.getByText('Welcome! You have signed up successfully.')
    );
});