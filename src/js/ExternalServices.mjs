export default class ExternalServices {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async getData() {
    try {
      const response = await fetch(this.baseURL);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch:", error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`);
      if (!response.ok) throw new Error("Product not found");
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  }
}
