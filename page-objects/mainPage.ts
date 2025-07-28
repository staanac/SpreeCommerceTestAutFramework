import { Page } from '@playwright/test'
import { AssertionsHelper } from '../utl/assertionsHelper'

export class MainPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async navigatingToLoginPage() {
        await this.page.waitForTimeout(1000);
        await this.page.locator(".hidden [data-action='click->slideover-account#toggle click@window->slideover-account#hide click->toggle-menu#hide touch->toggle-menu#hide']").click();
    }

    async navigatingToSignUpPage() {
        await this.page.waitForTimeout(1000);
        await this.page.getByRole('link', { name: 'Sign Up' }).click();
    }


    async navigatingToMainPage() {
        await this.page.waitForTimeout(1000)
        await this.page.getByRole('img', { name: 'Spree Commerce DEMO' }).click();
    }

    async navigatingToMyAccountPage() {
        await this.page.waitForTimeout(1000)
        await this.page.locator(".hidden [href='/account']").click();
    }

    async removeItemInMyCart() {
        await this.page.waitForTimeout(1000)
        const cartCounterInMainPage = await this.page.locator('#cart-pane-link .text-center').textContent();
        if (AssertionsHelper.extractNumber(cartCounterInMainPage) > 0) {
            await this.page.locator("[id*='cart-icon-']").click();
            await this.page.waitForTimeout(2000)
            const numberofItemsinCart = await this.page.locator("[id='24px/Cross']").count();
            for (let i = 0; i < numberofItemsinCart; i++) {
                await this.page.locator("[id='24px/Cross']").nth(0).click();
            }

            await this.page.locator("[data-action='click->slideover#toggle']").click();
        }
    }
}