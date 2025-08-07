import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/cart.html"),
        checkout: resolve(__dirname, "src/checkout/checkout.html"),
        product: resolve(__dirname, "src/product-pages/product-detail.html"),
        product_listing: resolve(
          __dirname,
          "src/product-listing/product-listing.html",
        ),
        wishlist: resolve(__dirname, "src/wishlist/wishlist.html"),
      },
    },
  },
});
