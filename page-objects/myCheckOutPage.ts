import { Page } from '@playwright/test'

export class CheckOutPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    // Proceed to checkout page
    async procedToCheckoutPage() {
        await this.page.waitForTimeout(1500);
        await this.page.getByRole('link', { name: 'Checkout' }).click();
        await this.page.waitForTimeout(1500)
    }

    // Populating shipping address fields
    async populateShippingAddress(isDefaultAddressExisting: boolean, country: string, firstName: string, lastName: string, street: string, apartment: string,
        city: string, postalCode: string, phoneNumber: string) {
        if (isDefaultAddressExisting == false) {
            await this.page.waitForTimeout(1000);
            await this.page.getByRole('checkbox', { name: 'Email me about new products, sales, and more. You can unsubscribe at any time.' }).check();
            await this.page.waitForTimeout(1000);
            await this.page.getByRole('combobox', { name: 'Country' }).selectOption(country);
            await this.page.getByRole('textbox', { name: 'First name' }).fill(firstName);
            await this.page.getByRole('textbox', { name: 'Last name' }).fill(lastName);
            await this.page.getByRole('textbox', { name: 'Street and house number' }).fill(street);
            await this.page.getByRole('textbox', { name: 'Apartment, suite, etc. (optional)' }).fill(apartment);
            await this.page.getByRole('textbox', { name: 'City' }).fill(city);
            await this.page.getByRole('textbox', { name: 'Postal Code' }).fill(postalCode);
            await this.page.getByRole('textbox', { name: 'Phone (optional)' }).fill(phoneNumber);
        }
    }

    // Proceed to Delivery page
    async proceedToDeliveryPage() {
        // Proceed to delivery page
        await this.page.getByRole('button', { name: 'Save and Continue' }).dblclick();
    }

    // Selecting delivery method
    async selectDeliveryMethod(deliveryMethod: string) {
        await this.page.waitForTimeout(1500);
        await this.page.getByText(deliveryMethod).dblclick();
    }

    // Proceed to Payment page
    async proceedToPaymentsPage() {
        await this.page.getByRole('button', { name: 'Save and Continue' }).click()
        await this.page.waitForTimeout(5000)
    }

    // Populating payment fields
    async populatePaymentPage(isDefaultPaymentExisting: boolean, cardNumber: string, expirationDate: string, cvc: string) {
        if (isDefaultPaymentExisting == false) {
            // Populate payment details
            const iFrame = this.page.frameLocator("div [title='Secure payment input frame']")
            await iFrame.locator('#Field-numberInput').fill(cardNumber);
            await iFrame.locator('#Field-expiryInput').fill(expirationDate);
            await iFrame.locator('#Field-cvcInput').fill(cvc);
        }
    }

    // Pay order
    async payOrder() {
        await this.page.waitForTimeout(3000)
        await this.page.getByRole('button', { name: 'Pay now' }).dblclick();
        await this.page.waitForTimeout(5000)
    }


}