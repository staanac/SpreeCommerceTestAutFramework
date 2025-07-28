import { Page } from '@playwright/test'
import test from 'node:test';

export class MyCartPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    // Update the product order details
    async addingProductToMyCart(productQuantity?: number) {
        let productColor = '';
        let productSize = '';
        let isProductAddedToCart = false;
        let isSoldOut = false

        // Get the product color count
        await this.page.waitForTimeout(2000);
        const colorCount = await this.page.locator("[name='Color']").count();

        if (colorCount > 0) {
            for (let j = 0; j < colorCount; j++) {

                // Select the product color
                await this.page.getByRole('listitem').filter({ has: this.page.locator("[name='Color']") }).nth(j).click();

                // Parse the product color
                productColor = await this.page.getByText('Color:').textContent() || '';
                productColor = productColor.slice(7)

                // Get the product size count
                const sizeCount = await this.page.locator("[name='Size']").count();

                if (sizeCount > 0) {
                    // Tap the product size button
                    await this.page.locator('#product-variant-picker').getByRole('button', { name: 'PLEASE CHOOSE SIZE' }).click();

                    for (let k = 0; k < sizeCount; k++) {
                        // Parse the product size
                        productSize = await this.page.locator("[for*=product-option]").nth(k).textContent() || '';

                        // Select product size
                        await this.page.locator('#product-variant-picker label').filter({ hasText: `${productSize}` }).click()

                        // Check if the product is sold out
                        await this.page.waitForTimeout(2000)
                        isSoldOut = await this.page.getByRole('button', { name: 'Notify me when available' }).isVisible();
                        if (isSoldOut == true)
                            await this.page.locator('#product-variant-picker').getByRole('button', { name: `Size: ${productSize}` }).click();
                        else {
                            // Update the product quantity
                            if (productQuantity != undefined) {
                                for (let i = 1; i < productQuantity; ++i) {
                                    await this.page.locator('.increase-quantity').click();
                                }
                            }

                            // Add product to cart
                            await this.page.getByRole('button', { name: "ADD TO CART" }).click();
                            break;
                        }
                    }
                };
                // Check if the product is added to cart
                await this.page.waitForTimeout(2000)
                isProductAddedToCart = await this.page.locator("#slideover-cart .items-center .text-xl").filter({ hasText: 'Cart' }).isVisible();
                if (isProductAddedToCart == true)
                    break;
                else {
                    await this.page.reload();
                };
            };
        }

        else {
            // Check if the product is sold out
            await this.page.waitForTimeout(2000)
            isSoldOut = await this.page.getByRole('button', { name: 'Notify me when available' }).isVisible();
            if (isSoldOut == false) {
                // Update the product quantity
                if (productQuantity != undefined) {
                    for (let i = 1; i < productQuantity; ++i) {
                        await this.page.locator('.increase-quantity').click();
                    }
                }

                // Add product to cart
                await this.page.getByRole('button', { name: "ADD TO CART" }).click();
            }

            // Check if the product is added to cart
            isProductAddedToCart = await this.page.locator("#slideover-cart .items-center .text-xl").filter({ hasText: 'Cart' }).isVisible();
        }

        return { productColor, productSize, isProductAddedToCart }

    }
}