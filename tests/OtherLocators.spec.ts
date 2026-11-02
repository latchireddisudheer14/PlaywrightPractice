import { test, expect } from '@playwright/test';

test('locate elements with CSS selectors', async ({ page }) => {
  await page.setContent(`
    <form id="signup">
      <label>Email <input name="email" type="email" /></label>
      <button class="submit">Sign up</button>
    </form>
    <section class="catalog featured">
      <div class="product-card" data-category="accessories">
        <h2 class="product-name">Keyboard</h2>
        <div class="details"><span class="price">$49</span></div>
        <button class="add-to-cart primary">Add to cart</button>
      </div>
      <div class="product-card" data-category="accessories">
        <h2 class="product-name">Mouse</h2>
        <div class="details"><span class="price">$25</span></div>
        <button class="add-to-cart">Add to cart</button>
      </div>
    </section>
    <nav>
      <a href="https://example.com/docs/start">Documentation</a>
      <a href="/downloads/guide.pdf">PDF guide</a>
    </nav>
    <input type="email" />
    <div class="card active highlighted">Active card</div>
    <p lang="en-US">English content</p>
    <div class="sibling-example">
      <h2>Keyboard</h2>
      <p class="price">$49</p>
      <p class="stock">In stock</p>
    </div>
  `);

  // Combine an element, id, and attribute selector.
  const emailInput = page.locator('form#signup input[name="email"]');
  // Match an element by class. A dot denotes each class name.
  const submitButton = page.locator('button.submit');
  // A space selects a descendant at any depth; > selects a direct child.
  const productNames = page.locator('.catalog .product-name');
  const directProductCards = page.locator('section.catalog > div.product-card');
  // :first-child matches an element that is the first element child of its parent.
  const firstProductCard = page.locator('.catalog > .product-card:first-child');
  // Combine multiple classes, and select by an attribute value.
  const primaryCartButton = page.locator('button.add-to-cart.primary');
  const accessoryCards = page.locator('.product-card[data-category="accessories"]');
  // Select a child beneath a particular parent using a descendant selector.
  const keyboardPrice = page.locator('.product-card:has(.product-name:text-is("Keyboard")) .details > .price');
  // * matches every element in the document.
  const allElements = page.locator('*');
  // .catalog * matches every descendant element inside .catalog, at any depth.
  const allCatalogDescendants = page.locator('.catalog *');
  // .catalog > * matches only the direct children of .catalog.
  const directCatalogChildren = page.locator('.catalog > *');
  // *.active matches any element that has the active class.
  const elementsWithActiveClass = page.locator('*.active');
  // * [data-kind] matches elements with data-kind that are descendants of another element.
  const descendantsWithDataKind = page.locator('* [data-kind]');
  // [attr="value"] matches an exact attribute value.
  const emailInputs = page.locator('input[type="email"]');
  // [attr*="value"] matches when the attribute contains the given substring.
  const docsLinks = page.locator('a[href*="docs"]');
  // [attr^="value"] matches when the attribute starts with the given string.
  const secureLinks = page.locator('a[href^="https://"]');
  // [attr$="value"] matches when the attribute ends with the given string.
  const pdfLinks = page.locator('a[href$=".pdf"]');
  // [attr~="value"] matches a whole word in a space-separated attribute value.
  const activeCards = page.locator('[class~="active"]');
  // [attr|="value"] matches the value itself or a value followed by a hyphen (e.g. en or en-US).
  const englishContent = page.locator('[lang|="en"]');
  // + matches only the immediately following sibling.
  const adjacentSibling = page.locator('.sibling-example h2 + p');
  // ~ matches all following siblings that share the same parent.
  const followingSiblings = page.locator('.sibling-example h2 ~ p');

  await emailInput.fill('user@example.com');
  await expect(emailInput).toHaveValue('user@example.com');
  await expect(submitButton).toHaveText('Sign up');
  await expect(productNames).toHaveText(['Keyboard', 'Mouse']);
  await expect(directProductCards).toHaveCount(2);
  await expect(firstProductCard).toContainText('Keyboard');
  await expect(primaryCartButton).toHaveCount(1);
  await expect(accessoryCards).toHaveCount(2);
  await expect(keyboardPrice).toHaveText('$49');
  await expect(allElements).toHaveCount(16);
  await expect(allCatalogDescendants).toHaveCount(8);
  await expect(directCatalogChildren).toHaveCount(2);
  await expect(elementsWithActiveClass).toHaveCount(0);
  await expect(descendantsWithDataKind).toHaveCount(0);
  await expect(emailInputs).toHaveCount(1);
  await expect(docsLinks).toHaveText('Documentation');
  await expect(secureLinks).toHaveCount(1);
  await expect(pdfLinks).toHaveText('PDF guide');
  await expect(activeCards).toHaveText('Active card');
  await expect(englishContent).toHaveText('English content');
  await expect(adjacentSibling).toHaveText('$49');
  await expect(followingSiblings).toHaveText(['$49', 'In stock']);
});

test('locate elements with XPath', async ({ page }) => {
  await page.setContent(`
    <ul id="products">
      <li><span class="name">Keyboard</span><button>Add</button></li>
      <li><span class="name">Mouse</span><button>Add</button></li>
    </ul>
  `);

  // XPath selectors begin with // or .. in Playwright.
  const products = page.locator('//ul[@id="products"]/li');
  const mouseName = page.locator('//li[.//span[text()="Mouse"]]//span[@class="name"]');

  await expect(products).toHaveCount(2);
  await expect(mouseName).toHaveText('Mouse');
  await products.nth(0).getByRole('button', { name: 'Add' }).click();
});

test('use Locator methods to refine and interact with matches', async ({ page }) => {
  await page.setContent(`
    <ul>
      <li class="product"><span>Keyboard</span><button>Add</button></li>
      <li class="product"><span>Mouse</span><button>Add</button></li>
    </ul>
  `);

  // page.locator() returns a Locator. Locators are lazy and can be chained/refined.
  const products = page.locator('li.product');
  const mouseProduct = products.filter({ hasText: 'Mouse' });
  const productNames = await products.locator('span').allTextContents();

  await expect(products).toHaveCount(2);
  expect(productNames).toEqual(['Keyboard', 'Mouse']);
  await expect(products.first()).toContainText('Keyboard');
  await expect(products.last()).toContainText('Mouse');
  await expect(mouseProduct).toHaveCount(1);

  await mouseProduct.locator('button').click();
  await expect(mouseProduct.locator('button')).toBeVisible();
});
