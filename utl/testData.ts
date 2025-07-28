import {faker} from '@faker-js/faker'

export const testData = {
    existingUserAccountWithCorrectCredentials: {
        username: "n@o.com",
        password: "Password123"
    },
    existingUserAccountWithIncorrectPassword: {
        username: "j@k.com",
        password: "Password122"
    },
    nonExistingUserAccount: {
        username: "zzz@zzz.com",
        password: "Password123"
    },
    newUserAccountWithInvalidPassword: {
        username: `${faker.person.firstName()}.${faker.person.lastName()}@test.com`,
        password: "Passw"
    },
    newUserAccountWherePasswordMismatched: {
        username: `${faker.person.firstName()}.${faker.person.lastName()}@test.com`,
        password: "Password123",
        passwordConfirmation: "Password122"
    },
    newUserAccountWithValidCredential: {
        username: `${faker.person.firstName()}.${faker.person.lastName()}@test.com`,
        password: "Password123",
    },
    productDetails: {
        productName: "Checkered Shirt",
        productColor: "Teal",
        productSize: "L",
        productQuantity: 2
    },
    shippingDetails: {
        country: "Philippines",
        firstName: "Juan",
        lastName: "Dela Cruz",
        streetName: "BGC",
        apartment: "Apt. AB",
        city: "Taguig",
        postalCode: "1636",
        phoneNumber: "09175639090",
        deliveryMethod: "Premium"
    },
    paymentDetails: {
        cardNumber: "4242424242424242",
        cardExpirationDate: "0130",
        cardCvc: "123"
    }

};