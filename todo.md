# Project To-Do List

## 1. Keystone & Database Setup
- [ ] **Verify Keystone Configuration**  
  - Ensure `keystone.ts` is finalized (no extra `createSystem` usage, correct server port, `.env` loading, etc.).  
  - Confirm the `Product` list schema (fields for `name`, `price`, `description`, `productImage`, `isFeatured`, etc.).
- [ ] **Migrate From SQLite if Needed**  
  - If we require decimal fields for price, consider switching to **PostgreSQL** or store prices in integer cents on SQLite.
- [ ] **Seed or Enter Dummy Data**  
  - Add a few test cake products with `isFeatured = true` for the homepage.  
  - Ensure images upload correctly (`productImage -> url`).

## 2. Next.js Frontend Pages
- [ ] **Homepage**  
  - Display “Featured Cakes” grid, pulling from Keystone via GraphQL.  
  - “About the Owner” section with personal bio & image.  
  - “Shop Now” button linking to the Catalog page.
- [ ] **Catalog Page**  
  - Show all products in a grid (image, name, short description, price).  
  - Provide “Add to Cart” button directly on each card.  
  - Optionally, a “View Details” button to open a modal with additional info (ingredients, size, etc.).

## 3. Cart Functionality
- [ ] **Create a Cart Context**  
  - Implement a `CartProvider` that stores items (`productId`, name, price, quantity, imageUrl, etc.).  
  - Provide `addToCart()` function for quick additions from product cards.
- [ ] **Display Cart Items**  
  - Add a `/cart` page or a mini-cart in the header.  
  - Show item name, quantity, and subtotal.  
  - Calculate totals (e.g., `(price * quantity)`).

## 4. Product Modal (Optional)
- [ ] **Implement a “View Details” Modal**  
  - Add size selector, quantity input, and extra details (ingredients, large image).  
  - “Add to Cart” button calls `addToCart` with chosen size & quantity.  
  - Properly handle open/close, focus-trap, and mobile responsiveness.

## 5. Image Handling & next.config.js
- [ ] **Serve Images from Keystone**  
  - Ensure images are stored at `http://localhost:3001/images/...`.  
  - Use a **fully qualified URL** in Next.js (e.g., `imageUrl = http://localhost:3001/images/xx.jpg`).
- [ ] **Update `next.config.js`**  
  - Add `remotePatterns` for `localhost:3001`.  
  - Confirm images load correctly in `<Image />` component (no 404s).

## 6. Git & Deployment Tasks
- [ ] **Remove Large Files (node_modules) from Git**  
  - Add `node_modules` to `.gitignore`.  
  - Use BFG or filter-branch if the large file is in commit history.  
  - Force push (carefully) once the big file is removed.
- [ ] **Set Up a Clean Remote Repo**  
  - Make sure the final repo on GitHub doesn’t exceed file size limits.  
  - Confirm you can push/pull without further errors.
- [ ] **Deployment Strategy**  
  - Decide if we’re deploying Keystone & Next.js together (monorepo with a single host) or separate services.  
  - Potentially set up a staging environment.

## 7. Optional Enhancements / Future Steps
- [ ] **Checkout Flow**  
  - Integrate Stripe or another payment system to process orders.  
  - Handle shipping/taxes, order confirmations, etc.
- [ ] **User Auth & More Advanced Cart**  
  - If we want persistent carts, consider storing them in Keystone’s DB.  
  - Implement roles/permissions if needed.
- [ ] **SEO & Performance**  
  - Add proper meta tags, improve Lighthouse scores, etc.  
  - Optimize images or add a CDN if the site grows.

## 8. Styling & Polish
- [ ] **Refine Pastel Pink/Gold Color Palette**  
  - Ensure brand consistency across homepage, catalog, cart, modals.  
- [ ] **Mobile Responsiveness**  
  - Test modals, product grids, and cart on various screen sizes.
- [ ] **Accessibility**  
  - Use semantic HTML, alt text, focus management for modals, etc.
