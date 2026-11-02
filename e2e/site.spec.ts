import { test, expect, type Page } from '@playwright/test';

/** Collects uncaught page errors and console errors so each test can assert on a clean console. */
function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) {
      errors.push(`console: ${m.text()}`);
    }
  });
  return errors;
}

test.describe('landing page', () => {
  test('renders every section with the 0.3.0 content and a clean console', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/');
    await expect(page).toHaveTitle(/pip-it-up/);
    await expect(page.locator('header.fixed')).toContainText('v0.3.0');

    for (const id of ['hero', 'features', 'browser-support', 'comparison', 'roadmap']) {
      await expect(page.locator(`section#${id}`), id).toBeAttached();
    }

    const features = page.locator('#features');
    await expect(features).toContainText('Tested in Real Browsers');
    await expect(features).toContainText('Honest Errors');
    await expect(features).toContainText('Route-Persistent PiP');

    const support = page.locator('#browser-support');
    await expect(support).toContainText('151+');
    await expect(support).toContainText('Video PiP');

    const roadmap = page.locator('#roadmap');
    await expect(roadmap).toContainText('Vue and Svelte bindings');
    await expect(roadmap).toContainText('v1.0 stable release');

    expect(errors).toEqual([]);
  });

  test('theme toggle switches and persists', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await page.locator('#theme-toggle').click();
    const first = await html.getAttribute('class');
    expect(first).toMatch(/\b(dark|light)\b/);
    await page.reload();
    await expect(html).toHaveClass(new RegExp(`\\b${first!.match(/dark|light/)![0]}\\b`));
    await page.locator('#theme-toggle').click();
    expect(await html.getAttribute('class')).not.toBe(first);
  });

  test('navbar links to docs', async ({ page }) => {
    await page.goto('/');
    await page.locator('header.fixed').getByRole('link', { name: /documentation/i }).click();
    await expect(page).toHaveURL(/\/docs/);
  });

  test('hero demo hydrates', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('astro-island[client="load"]').first()).not.toHaveAttribute('ssr', /.+/, { timeout: 10_000 });
  });
});

test.describe('docs', () => {
  test('every section opens and renders content with no errors', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/docs');
    const nav = page.locator('aside nav');
    await expect(nav).toBeVisible();
    const buttons = nav.getByRole('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(26);

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const title = (await btn.innerText()).trim();
      await btn.click();
      await expect(page.locator('main h1'), title).toHaveText(title);
      await expect(page.locator('pre, table, p').first(), title).toBeVisible();
    }
    expect(errors).toEqual([]);
  });

  test('new 0.3.0 sections exist and deep-link by hash', async ({ page }) => {
    for (const [hash, text] of [
      ['upgrading-0-3-0', 'open() now rejects'],
      ['errors-reference', 'ERR_OPEN_ABORTED'],
      ['native-video-pip', 'webkitSetPresentationMode'],
      ['core-gotchas', 'Cross-origin iframes'],
      ['core-security', 'Trusted Types'],
      ['vanilla-route-persistence', 'registerTeardown'],
      ['react-gotchas', 'updateRoot'],
      ['react-errors', 'ERR_SHUTTLE_MOVE_FAILED'],
      ['create-pip-options', 'disallowReturnToOpener'],
    ] as const) {
      await page.goto(`/docs#${hash}`);
      await expect(page.locator('body'), hash).toContainText(text);
    }
  });

  test('old #upgrading link still resolves', async ({ page }) => {
    await page.goto('/docs#upgrading');
    await expect(page.locator('body')).toContainText('Upgrading to 0.2.0');
  });

  test('search finds new content and shows results', async ({ page }) => {
    await page.goto('/docs');
    await page.getByPlaceholder('Search docs...').fill('ERR_OPEN_ABORTED');
    await expect(page.locator('aside')).toContainText('Errors & Rejections');
    await page.getByPlaceholder('Search docs...').fill('zzzz-no-such-thing');
    await expect(page.locator('aside nav')).toHaveCount(0);
  });

  test('internal doc links point at real sections', async ({ page }) => {
    await page.goto('/docs#upgrading-0-3-0');
    await page.locator('a[href="#errors-reference"]').first().click();
    await expect(page.locator('body')).toContainText('PipOpenErrorCode');
  });

  test('code blocks get copy buttons', async ({ page }) => {
    await page.goto('/docs#quickstart');
    await expect(page.locator('pre.code-block .copy-btn-wrapper').first()).toBeAttached();
  });
});

test('mobile viewport has no horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  for (const path of ['/', '/docs#core-security', '/docs#create-pip-options']) {
    await page.goto(path);
    await page.waitForTimeout(500);
    const overflow = await page.evaluate(() => {
      window.scrollTo(200, 0);
      return window.scrollX;
    });
    expect(overflow, path).toBe(0);
  }
});
