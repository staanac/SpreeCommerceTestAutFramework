import { Page } from '@playwright/test'
import { MyCartPage } from './myCartPage';

export class ProductsPage {
    myCartPage: MyCartPage;

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
        this.myCartPage = new MyCartPage(page);

    }

    async addingProductToCartUnderShopAll(productQuantity?: number) {

        // Variables
        let productName = '';
        let isOnSale = false;
        let productPrice = '';
        let productColor = '';
        let productSize = '';
        let isProductAddedToCart = false;

        // Click  Shop All button
        await this.page.locator(".flex .header--nav-item [data-title='shop all']").click();

        //await page.waitForLoadState('networkidle');

        // Getting the product count
        await this.page.waitForTimeout(2000);
        const productCount = await this.page.locator("#products .swiper-slide").count();

        for (let i = 0; i < productCount; i++) {
            productName = await this.page.locator('.product-card-inner .product-card-title').nth(i).textContent() || '';

            // Check if product is on sale
            isOnSale = await this.page.locator('.product-card a').nth(i).locator('.product-label--sale').isVisible();

            // Parse the product price
            if (isOnSale == true)
                productPrice = await this.page.locator('.product-card-price').nth(i).locator('div .text-danger').textContent() || '';
            else
                productPrice = await this.page.locator('.product-card-price').nth(i).locator('div p').textContent() || '';

            // Select the product
            await this.page.locator('.product-card-inner .product-card-title').nth(i).click();

            // Update the product order details
            ({ productColor, productSize, isProductAddedToCart } = await this.myCartPage.addingProductToMyCart(productQuantity));

            // Check if the product is added to cart
            await this.page.waitForTimeout(2000)
            if (isProductAddedToCart == true)
                break;
            else
                await this.page.locator(".flex .header--nav-item [data-title='shop all']").click();
        }

        // Return the product details: Product Name, Price, Color and Size
        return {
            productName,
            isOnSale,
            productPrice,
            productColor,
            productSize
        };
    }
}