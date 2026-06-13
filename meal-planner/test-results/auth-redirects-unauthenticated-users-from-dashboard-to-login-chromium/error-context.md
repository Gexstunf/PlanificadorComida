# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> redirects unauthenticated users from dashboard to login
- Location: tests\e2e\auth.spec.js:3:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:5173/dashboard
Call log:
  - navigating to "http://127.0.0.1:5173/dashboard", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "No se puede acceder a este sitio web" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - text: La página
      - strong [ref=e9]: 127.0.0.1
      - text: ha rechazado la conexión.
    - generic [ref=e10]:
      - paragraph [ref=e11]: "Prueba a:"
      - list [ref=e12]:
        - listitem [ref=e13]: Comprobar la conexión
        - listitem [ref=e14]:
          - link "Comprobar el proxy y el cortafuegos" [ref=e15] [cursor=pointer]:
            - /url: "#buttons"
    - generic [ref=e16]: ERR_CONNECTION_REFUSED
  - generic [ref=e17]:
    - button "Volver a cargar" [ref=e19] [cursor=pointer]
    - button "Detalles" [ref=e20] [cursor=pointer]
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test'
  2  | 
  3  | test('redirects unauthenticated users from dashboard to login', async ({ page }) => {
> 4  |   await page.goto('/dashboard')
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:5173/dashboard
  5  | 
  6  |   await expect(page).toHaveURL(/\/login$/)
  7  |   await expect(page.getByRole('heading', { name: /meal planner/i })).toBeVisible()
  8  |   await expect(page.getByLabel(/email/i)).toBeVisible()
  9  |   await expect(page.getByLabel(/contrase/i)).toBeVisible()
  10 | })
  11 | 
```