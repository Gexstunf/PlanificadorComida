import { expect, test } from '@playwright/test'

test('redirects unauthenticated users from dashboard to login', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: /meal planner/i })).toBeVisible()
  await expect(page.getByLabel(/email/i)).toBeVisible()
  await expect(page.getByLabel(/contrase/i)).toBeVisible()
})
