import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPad portrait', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
];

const PAGES = [
  '/',
  '/docs',
  '/docs#upgrading-0-3-0',
  '/docs#create-pip-options',
  '/docs#route-persistent',
  '/docs#core-security',
  '/docs#react-errors',
];

for (const vp of VIEWPORTS) {
  test.describe(`${vp.name} (${vp.width}px)`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const path of PAGES) {
      test(`${path} fits the viewport`, async ({ page }) => {
        await page.goto(path);
        await page.waitForTimeout(600);
        const scrollX = await page.evaluate(() => {
          window.scrollTo(300, 0);
          return window.scrollX;
        });
        expect(scrollX, 'page scrolls sideways').toBe(0);

        // Layout widths (offsetWidth ignores the decorative rotate transforms that inflate bounding boxes).
        const wide = await page.evaluate((w) => {
          const out: string[] = [];
          document
            .querySelectorAll<HTMLElement>('main, section > div, .docs-content > *, header.fixed, footer, aside')
            .forEach((el) => {
              if (el.offsetWidth > w + 1) out.push(`${el.tagName}.${String(el.className).slice(0, 40)} ${el.offsetWidth}`);
            });
          const content = document.querySelector<HTMLElement>('.docs-content');
          if (content && content.scrollWidth > content.clientWidth + 1) out.push(`docs content overflows ${content.scrollWidth}>${content.clientWidth}`);
          return out;
        }, vp.width);
        expect(wide, 'elements wider than viewport').toEqual([]);
      });
    }

    test('navbar is usable', async ({ page }) => {
      await page.goto('/');
      const header = page.locator('header.fixed');
      await expect(header).toBeVisible();
      await expect(header.locator('#theme-toggle')).toBeVisible();
      const box = await header.boundingBox();
      expect(box!.width).toBeLessThanOrEqual(vp.width + 1);
      const docsLink = header.getByRole('link', { name: /documentation/i });
      if (vp.width >= 768) await expect(docsLink).toBeVisible();
      else await expect(docsLink).toBeHidden();
    });

    test('hero CTA and install command are reachable', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#cta-get-started')).toBeVisible();
      const cmd = page.locator('#install-command');
      await expect(cmd).toBeVisible();
      const r = await cmd.boundingBox();
      expect(r!.x).toBeGreaterThanOrEqual(0);
      expect(r!.x + r!.width).toBeLessThanOrEqual(vp.width + 1);
    });

    test('docs layout adapts', async ({ page }) => {
      await page.goto('/docs');
      const aside = page.locator('aside#docs-sidebar');
      const main = page.locator('main');
      await expect(main).toBeVisible();
      if (vp.width >= 768) {
        await expect(aside).toBeVisible();
        const a = (await aside.boundingBox())!;
        const m = (await main.boundingBox())!;
        expect(m.x, 'sidebar beside content').toBeGreaterThan(a.x + a.width - 20);
      } else {
        // Phones: content comes first, the sidebar is a drawer behind the picker.
        await expect(aside).toBeHidden();
        const m = (await main.boundingBox())!;
        expect(m.y, 'content starts near the top').toBeLessThan(vp.height * 0.5);
      }
      const toc = page.getByText('On This Page');
      if (vp.width >= 1024) await expect(toc).toBeVisible();
      else await expect(toc).toBeHidden();
    });

    test('docs drawer navigates on phones', async ({ page }) => {
      test.skip(vp.width >= 768, 'drawer is phone/small-tablet only');
      await page.goto('/docs');
      const picker = page.getByRole('button', { name: /Introduction/ }).first();
      await expect(picker).toBeVisible();
      const box = (await picker.boundingBox())!;
      expect(box.height, 'tap target').toBeGreaterThanOrEqual(44);
      await picker.click();
      const aside = page.locator('aside#docs-sidebar');
      await expect(aside).toBeVisible();
      await page.getByPlaceholder('Search docs...').fill('ERR_OPEN_ABORTED');
      await aside.getByRole('button', { name: /Errors & Rejections/ }).first().click();
      await expect(aside).toBeHidden();
      await expect(page.locator('main h1')).toHaveText('Errors & Rejections');
      // Escape closes the drawer.
      await page.getByRole('button', { name: /Errors & Rejections/ }).first().click();
      await expect(aside).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(aside).toBeHidden();
    });

    test('docs reading controls fit a phone', async ({ page }) => {
      test.skip(vp.width >= 768, 'phone only');
      await page.goto('/docs#quickstart');
      const copy = page.locator('pre.code-block button[data-copy]').first();
      await expect(copy).toBeVisible(); // visible without hover on touch widths
      await expect(page.getByText(/On this page \(/)).toBeVisible();
    });

    test('docs tables stay inside the content column', async ({ page }) => {
      await page.goto('/docs#create-pip-options');
      await page.locator('.docs-content .table-scroll').first().waitFor();
      const { tableW, mainW } = await page.evaluate(() => ({
        tableW: document.querySelector<HTMLElement>('.docs-content .table-scroll')!.offsetWidth,
        mainW: document.querySelector<HTMLElement>('.docs-content')!.offsetWidth,
      }));
      expect(tableW).toBeLessThanOrEqual(mainW + 1);
    });

    test('feature grid does not overflow its container', async ({ page }) => {
      await page.goto('/');
      const section = (await page.locator('#features').boundingBox())!;
      expect(section.width).toBeLessThanOrEqual(vp.width + 1);
      const cols = await page.evaluate(() => {
        const xs = new Set<number>();
        document.querySelectorAll('#features [class*="rotate"]').forEach((el) => xs.add(Math.round(el.getBoundingClientRect().left / 40)));
        return xs.size;
      });
      expect(cols).toBeGreaterThan(0);
    });
  });
}
