import { Page } from '@playwright/test'

export class SignInPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async populateSignInPage(email?: string, password?: string, passwordConfirmation?: string) {
        // Populating the email address field
        if (email != undefined)
            await this.page.locator('#user_email').fill(email);
        // Populating the password field
        if (password != undefined)
            await this.page.locator('#user_password').fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();
    }
}