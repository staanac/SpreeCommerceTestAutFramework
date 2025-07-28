import { Page } from '@playwright/test'

export class SignUpPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async populateSignUpPage(email?: string, password?: string, passwordConfirmation?: string) {
        // Populating the email address field
        if (email != undefined)
            await this.page.locator('#user_email').fill(email);
        // Populating the password field
        if (password != undefined)
            await this.page.locator('#user_password').fill(password);
        // Populating the password confirmation field
        if (passwordConfirmation != undefined)
            await this.page.locator('#user_password_confirmation').fill(passwordConfirmation);
        await this.page.getByRole('button', { name: 'Sign Up' }).click();
    }
}