import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  appType: "mpa", // <-- critical: disable SPA fallback in dev
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        "index.html": resolve(__dirname, "src/index.html"),
        "cart/cart.html": resolve(__dirname, "src/cart/cart.html"),
        "checkout/checkout.html": resolve(__dirname, "src/checkout/checkout.html"),
        "checkout/confirmation.html": resolve(__dirname, "src/checkout/confirmation.html"),
        "product-pages/product-detail.html": resolve(
          __dirname,
          "src/product-pages/product-detail.html"
        ),
        "product-listing/product-listing.html": resolve(
          __dirname,
          "src/product-listing/product-listing.html"
        )
      }
    }
  }
});
