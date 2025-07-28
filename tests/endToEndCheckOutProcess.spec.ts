import { test, expect } from '../utl/fixtures'
import { ProductsPage } from '../page-objects/productsPage';
import { CheckOutPage } from '../page-objects/myCheckOutPage';
import { MainPage } from '../page-objects/mainPage';
import { MyAccountPage } from '../page-objects/myAccountPage';
import { AssertionsHelper } from '../utl/assertionsHelper';
import { testData } from '../utl/testData';
import { fi } from '@faker-js/faker';

// Global Variables
const { country, firstName, lastName, streetName, apartment, city, postalCode, phoneNumber, deliveryMethod } = testData.shippingDetails;
const { username } = testData.existingUserAccountWithCorrectCredentials;
const { cardNumber, cardExpirationDate, cardCvc } = testData.paymentDetails;
const { productQuantity } = testData.productDetails;

test.beforeEach(async ({ login }) => {
    await login();
})

test('Validation where the user selected a single product the continue with checkout process.', async ({ page }) => {
    // Page objects:
    const productPage = new ProductsPage(page);
    const checkoutPage = new CheckOutPage(page);
    const mainPage = new MainPage(page);
    const myAccountPage = new MyAccountPage(page);

    // Check if there are existing products in cart
    await mainPage.removeItemInMyCart();

    // Adding product in cart parse product details
    let { productName, isOnSale, productPrice, productColor, productSize } =
        await productPage.addingProductToCartUnderShopAll(productQuantity);

    // Assertion: Ensure correct quantity was reflected in the cart icon
    const cartIconCounter = await page.locator('#slideover-cart .items-center .w-6 .cart-counter').textContent();
    await AssertionsHelper.verifyNumberEquality(
        cartIconCounter,
        productQuantity
    );

    // Parse the product price depending if the product is on sale or not
    let productPriceInCart: string | null;
    if (isOnSale == true)
        productPriceInCart = await page.locator('.text-sm .text-danger').textContent();
    else
        productPriceInCart = await page.locator('.ml-3 .mb-2').textContent();

    // Assertion: Ensure correct product price was reflected in the cart
    await AssertionsHelper.verifyNumberEquality(
        productPriceInCart,
        productPrice
    );

    // Assertion: Ensure correct product was reflected in the cart
    await AssertionsHelper.verifyTextContains(
        page.locator('.cart-line-item .ml-3 .justify-between .font-semibold'),
        productName
    );

    // Assertion: Ensure correct product color was reflected in the cart
    await AssertionsHelper.verifyTextContains(
        page.locator('.cart-line-item .ml-3 .flex-wrap .label-container .text-sm'),
        productColor
    );

    // Assertion: Ensure correct product size was reflected in the cart
    await AssertionsHelper.verifyTextContains(
        page.locator('.ml-3 .gap-2 div .text-sm').nth(1),
        productSize
    );

    // Assertion: Ensure correct product quantity was reflected in the cart
    await AssertionsHelper.verifyExactValue(
        page.locator('#line_item_quantity'),
        productQuantity.toString()
    );

    // Assertion: Ensure correct total amount due was reflected in the cart
    const expectedTotalAmountDue = AssertionsHelper.extractNumber(productPrice) * AssertionsHelper.extractNumber(cartIconCounter);
    const totalAmountDueInCart = await page.locator('.shopping-cart-total-text .shopping-cart-total-amount').textContent();
    await AssertionsHelper.verifyNumberEquality(
        totalAmountDueInCart,
        expectedTotalAmountDue
    );

    // Proceed to checkout page
    await checkoutPage.procedToCheckoutPage();

    // Checking if there is already existing delivery address
    const isDefaultAddressExisting = await page.getByText('This is your default delivery address').isVisible();
    await checkoutPage.populateShippingAddress(
        isDefaultAddressExisting,
        country,
        firstName,
        lastName,
        streetName,
        apartment,
        city,
        postalCode,
        phoneNumber);

    // Assertion: Address page
    // Assertion: Ensure correct product quantity was reflected in Address page
    const addressPageProductQuantity = await page.locator("#checkout_line_items .overflow-y-auto .justify-between .mr-5 .rounded-full").textContent();
    await AssertionsHelper.verifyNumberEquality(
        addressPageProductQuantity,
        productQuantity
    );

    // Assertion: Ensure correct product name was reflected in Address page
    await AssertionsHelper.verifyDetailVisibleByFilter(
        page.getByRole('paragraph'),
        productName
    );

    // Assertion: Ensure correct product color was reflected in Address page
    await AssertionsHelper.verifyProductColorVisible(
        page.getByRole('paragraph'),
        productColor
    );

    // Assertion: Ensure correct product size was reflected
    await AssertionsHelper.verifyProductSizeVisible(
        page.getByRole('paragraph'),
        productSize
    );

    // Assertion: To ensure that the correct total amount was reflected
    const addressPageTotalAmount = await page.locator('.justify-between div #summary-order-total').textContent();
    await AssertionsHelper.verifyNumberEquality(
        addressPageTotalAmount,
        expectedTotalAmountDue
    );

    // Proceed to Delivery page
    await checkoutPage.proceedToDeliveryPage();

    // Selecting delivery method
    await checkoutPage.selectDeliveryMethod(deliveryMethod);

    // Assertion: Delivery page
    // Assertion: Ensure correct First Name and Last Name was reflected in Delivery page
    await AssertionsHelper.verifyDetailVisibleByFilter(
        page.getByRole('paragraph'),
        `${firstName} ${lastName}`
    );

    // Assertion: Ensure correct email was reflected in Delivery page
    await AssertionsHelper.verifyDetailVisibleByFilter(
        page.getByRole('paragraph'),
        username
    );

    // Assertion: Ensure correct shipping details was reflected in Delivery page
    await AssertionsHelper.verifyDetailVisible(
        page.getByText(`${firstName} ${lastName}, ${streetName}, ${apartment}, ${city}, ${postalCode}, ${country}`)
    );

    // Assertion: Ensure correct product quantity was reflected in Delivery page
    const deliveryPageQuantity = await page.locator("#checkout_line_items .overflow-y-auto .justify-between .mr-5 .rounded-full").textContent();
    await AssertionsHelper.verifyNumberEquality(
        deliveryPageQuantity,
        productQuantity
    );

    // Assertion: Ensure correct product name was reflected in Address page
    await AssertionsHelper.verifyDetailVisibleByFilter(
        page.getByRole('paragraph'),
        productName
    );

    // Assertion: Ensure correct product color was reflected in Address page
    await AssertionsHelper.verifyProductColorVisible(
        page.getByRole('paragraph'),
        productColor
    );

    // Assertion: Ensure correct product size was reflected in Address page
    await AssertionsHelper.verifyProductSizeVisible(
        page.getByRole('paragraph'),
        productSize
    );

    // Check if shipping fee is free
    const isShippingFeeFree = await page.getByText('Free').isVisible();

    // Parsing total amount in delivery page
    const deliveryPageTotalAmount = await page.locator('.justify-between div #summary-order-total').textContent();

    // Assertion: Ensure correct total amount was reflected in Address page
    if (isShippingFeeFree == true) {
        await AssertionsHelper.verifyNumberEquality(
            deliveryPageTotalAmount,
            expectedTotalAmountDue
        );
    }

    // Parse shipping fee
    const shippingFee = await page.getByRole('listitem').filter({ hasText: deliveryMethod }).locator('.custom-control .text-right').textContent();

    // Proceed to Delivery page
    await checkoutPage.proceedToPaymentsPage();

    // Checking if there is already existing payment
    const isDefaultPaymentExisting = await page.getByText('Add a new card').isVisible();
    await checkoutPage.populatePaymentPage(
        isDefaultPaymentExisting,
        cardNumber,
        cardExpirationDate,
        cardCvc);

    // Assertion: Payment page
    // Assertion: Ensure correct First Name and Last Name was reflected in Payment page
    await AssertionsHelper.verifyDetailVisibleByFilter(
        page.getByRole('paragraph'),
        `${firstName} ${lastName}`
    );

    // Assertion: Ensure correct email was reflected in Payment page
    await AssertionsHelper.verifyDetailVisibleByFilter(
        page.getByRole('paragraph'),
        username
    );

    // Assertion: Ensure correct shipping details was reflected in Payment page
    await AssertionsHelper.verifyDetailVisible(
        page.getByText(`${firstName} ${lastName}, ${streetName}, ${apartment}, ${city}, ${postalCode}, ${country}`)
    );

    // Assertion: Ensure correct delivery method was reflected in Payment page
    await AssertionsHelper.verifyDetailVisibleByFilter(
        page.getByRole('paragraph'),
        deliveryMethod
    );

    // Parse shipping fee
    const paymentPageDeliveryFee = await page.getByRole('paragraph').filter({ hasText: deliveryMethod }).locator('strong').textContent();

    // Assertion: Ensure correct shipping fee was reflected in Payment page
    if (isShippingFeeFree == true) {
        await AssertionsHelper.verifyNumberEquality(
            paymentPageDeliveryFee,
            0.00
        );
    }
    else {
        await AssertionsHelper.verifyNumberEquality(
            paymentPageDeliveryFee,
            shippingFee
        );
    }

    // Assertion: Ensure correct product quantity was reflected in Payment page
    const paymentPageQuantity = await page.locator("#checkout_line_items .overflow-y-auto .justify-between .mr-5 .rounded-full").textContent();
    await AssertionsHelper.verifyNumberEquality(
        paymentPageQuantity,
        productQuantity
    );

    // Assertion: Ensure correct product name was reflected in Address page
    await AssertionsHelper.verifyDetailVisibleByFilter(
        page.getByRole('paragraph'),
        productName
    );

    // Assertion: Ensure correct product color was reflected in Address page
    await AssertionsHelper.verifyProductColorVisible(
        page.getByRole('paragraph'),
        productColor
    );

    // Assertion: Ensure correct product size was reflected
    await AssertionsHelper.verifyProductSizeVisible(
        page.getByRole('paragraph'),
        productSize
    );

    // Parsing total amount in delivery page
    const paymentPageTotalAmount = await page.locator('.justify-between div #summary-order-total').textContent();

    // Assertion: Ensure correct total amount was reflected in Address page
    if (isShippingFeeFree == true) {
        await AssertionsHelper.verifyNumberEquality(
            paymentPageTotalAmount,
            expectedTotalAmountDue
        );
    }

    // Pay order
    await checkoutPage.payOrder();

    // Assertion: Order Confirmation Page
    // Assertion: Ensure order was created successfully
    await AssertionsHelper.verifyDetailVisible(
        page.getByRole('heading', { name: 'Your order is confirmed!' })
    );

    // Assertion: Ensure order was paid successfully
    await AssertionsHelper.verifyDetailVisible(
        page.getByRole('heading', { name: 'Your order is confirmed!' })
    );

    // Assertion: Ensure correct email was refleted in Order Confirmation page
    await AssertionsHelper.verifyDetailVisibleByFilter(
        page.getByRole('paragraph'),
        username
    );

    // Assertion: Ensure correct name was reflected in Order Confirmation page
    await AssertionsHelper.verifyDetailVisible(
        page.getByRole('paragraph').filter({ hasText: `${firstName} ${lastName}` }).first()
    );

    // Assertion: Ensure correct street name was reflected in Order Confirmation page
    await AssertionsHelper.verifyDetailVisible(
        page.getByRole('paragraph').filter({ hasText: streetName }).first()
    );

    // Assertion: Ensure correct apartment was reflected in Order Confirmation page
    await AssertionsHelper.verifyDetailVisible(
        page.getByRole('paragraph').filter({ hasText: apartment }).first()
    );

    // Assertion: Ensure correct city was reflected in Order Confirmation page
    await AssertionsHelper.verifyDetailVisible(
        page.getByRole('paragraph').filter({ hasText: city }).first()
    );

    // Assertion: Ensure correct postal code was reflected in Order Confirmation page
    await AssertionsHelper.verifyDetailVisible(
        page.getByRole('paragraph').filter({ hasText: postalCode }).first()
    );

    // Assertion: Ensure correct country was reflected in Order Confirmation page
    await AssertionsHelper.verifyDetailVisible(
        page.getByRole('paragraph').filter({ hasText: country }).first()
    );

    // Parse Order ID
    const orderId = await page.getByRole('paragraph').filter({ hasText: 'Order' }).locator('strong').textContent();

    // Proceed to Main page
    await mainPage.navigatingToMainPage();

    // Proceed to My Account page
    await mainPage.navigatingToMyAccountPage();

    // Retrieve order
    await myAccountPage.retrieveOrder(orderId!);

    // Assertion: Order Details page
    // Assertion: Ensure correct order was retrieved
    await AssertionsHelper.verifyDetailVisibleByFilter(
        page.getByRole('heading'),
        orderId!
    );

    // Assertion: Ensure correct product name was reflected
    await AssertionsHelper.verifyDetailVisible(
        page.getByRole('link', { name: productName })
    );

    // Assertion: Ensure correct product color was reflected
    await AssertionsHelper.verifyDetailVisible(
        page.getByText(productColor)
    );

    // Assertion: Ensure correct product size was reflected
    await AssertionsHelper.verifyDetailVisibleByFilter(
        page.locator('.gap-2 div .text-sm').nth(1),
        productSize
    )

    // Assertion: Ensure correct product quantity was reflected
    await AssertionsHelper.verifyDetailVisible(
        page.getByText(`Quantity: ${productQuantity.toString()}`)
    );

    // Assertion: Ensure correct total amount was reflected
    const totalAmountDueWithShippingFee = expectedTotalAmountDue + Number(shippingFee?.replace(/[^\d.-]/g, ''))
    if (isShippingFeeFree == true) {
        await AssertionsHelper.verifyDetailVisible(
            page.getByText(expectedTotalAmountDue.toString()).nth(1)
        );
    }
    else {
        await AssertionsHelper.verifyDetailVisible(
            page.getByText(totalAmountDueWithShippingFee.toString())
        );
    }
});

test.afterEach(async ({ logout }) => {
    await logout();
});