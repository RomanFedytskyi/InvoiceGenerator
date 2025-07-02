import { test, expect } from '@playwright/test';

test.describe('Invoice Form End-to-End', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Make sure the main form is present
    await page.waitForSelector('[data-testid="section-general"]');
  });

  test('should fill and save all sections', async ({ page }) => {
    // Open the "General Info" panel if it's not open by default
    const generalPanel = await page.getByRole('button', { name: /general info/i });
    if (await generalPanel.getAttribute('aria-expanded') === 'false') {
      await generalPanel.click();
    }

    await page.getByTestId('input-company-name').fill('ACME Corp');
    await page.getByTestId('input-invoice-number').fill('INV-1001');

    // Set Due By Days (toggle Switch by clicking the <label>)
    await page.locator('label:has([data-testid="switch-due-days"])').click();
    await page.getByTestId('input-due-in-days').fill('15');

    // From Section
    await page.getByRole('button', { name: /from/i }).click();
    await page.getByTestId('input-from-name').fill('John Doe');
    await page.getByTestId('input-from-address').fill('123 Main St');
    await page.getByTestId('input-from-phone').fill('555-1234');
    await page.getByTestId('input-from-email').fill('john@acme.com');

    // To Section
    await page.getByRole('button', { name: /bill to/i }).click();
    await page.getByTestId('input-client-name').fill('Jane Smith');
    await page.getByTestId('input-client-address').fill('789 Market Ave');

    // Line Items
    await page.getByRole('button', { name: /line items/i }).click();
    await page.getByTestId('input-description-0').fill('Consulting');
    await page.getByTestId('input-qty-0').fill('10');
    await page.getByTestId('input-price-0').fill('100');
    // Add another item
    await page.getByTestId('add-item').click();
    await page.getByTestId('input-description-1').fill('Development');
    await page.getByTestId('input-qty-1').fill('20');
    await page.getByTestId('input-price-1').fill('200');

    // Payment Info
    await page.getByRole('button', { name: /payment info/i }).click();
    await page.getByTestId('input-bank-name').fill('Bank of Test');
    await page.getByTestId('input-bank-address').fill('321 Bank Rd');
    await page.getByTestId('input-routing-number').fill('123456789');
    await page.getByTestId('input-account-number').fill('987654321');
    await page.getByTestId('input-payment-reference').fill('For Services');

    // Simulate refresh to check persistence
    await page.reload();
    await page.waitForSelector('[data-testid="section-general"]');
    await expect(page.getByTestId('input-company-name')).toHaveValue('ACME Corp');
    await expect(page.getByTestId('input-invoice-number')).toHaveValue('INV-1001');
    await expect(page.getByTestId('input-from-name')).toHaveValue('John Doe');
    await expect(page.getByTestId('input-client-name')).toHaveValue('Jane Smith');
    await expect(page.getByTestId('input-description-1')).toHaveValue('Development');
    // ...add more as needed
  });

  test('should auto-save and restore form state from localStorage', async ({ page }) => {
    await page.getByTestId('input-company-name').fill('ACME Corp');
    await page.getByTestId('input-invoice-number').fill('INV-1002');

    // Simulate browser reload
    await page.reload();
    await page.waitForSelector('[data-testid="section-general"]');

    // Verify restored values
    await expect(page.getByTestId('input-company-name')).toHaveValue('ACME Corp');
    await expect(page.getByTestId('input-invoice-number')).toHaveValue('INV-1002');
  });
});
