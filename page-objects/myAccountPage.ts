import { Page } from '@playwright/test'

export class MyAccountPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async retrieveOrder(orderId: string) {
        await this.page.waitForTimeout(1000)
        // Getting all the orders
        const orderList = this.page.locator('tbody tr');
        await this.page.waitForTimeout(2000)
        const orderCount = await orderList.count();
        for (let i = 0; i < orderCount; ++i) {
            // Getting the specific row for order ID and getting order ID
            const rowNumber = await orderList.nth(i).textContent();
            if (rowNumber!.includes(`#${orderId}`)) {
                // Getting the specific row for view button and clicking the button
                await orderList.nth(i).locator(".mb-4").filter({ hasText: orderId }).click();
                break;
            };
        };
    };

    async logout() {
        await this.page.getByRole('button', { name: 'Log Out' }).click()
    };


}