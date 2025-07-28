# 🎭 Overview

This repository contains automated tests for **https://demo.spreecommerce.org/**, built using [Playwright](https://playwright.dev/). 

It supports validation for sign in, sign up and end-to-end order lifecycle testing across modern browsers.

---

## 🚀 Tech Stack

- **Language**: TypeScript
- **Framework**: [Playwright](https://playwright.dev/)
- **Test Runner**: `@playwright/test`
- **Reporting**: Playwright HTML Reporter

---

## 📁 Folder Structure
```sh
 |- tests # Test spec files
 |- page-objects # Page Object Models
 |- utl # Test data, Fixtures, Helper
 |- playwright.config.ts # Playwright configuration
 |- README.md # Project documentation
```
## ⚙️ Setup Instructions

1. Clone the Repository
```Shell
git clone https://github.com/staanac/SpreeCommerceTestAutomationScript.git
```
2. Install Dependencies
```Shell
npm install
```
## 🧪 Running Tests
1. Run All Tests
```Shell
npx playwright test
```
2. Run a Specific Test File
```Shell
npx playwright test tests/[Test file name]
```
3. Run Tests in Headed Mode (for debugging)
```Shell
npx playwright test --headed
```
4. Run with UI Mode
```Shell
npx playwright test --ui
```
📊 View Test Report

After tests complete, to view the generated HTML report:
```Shell
npx playwright show-report
```
📦 Test Data

You may locate the test data at this folder: **/utl/testData**. Update or extend the data as needed for your tests.


