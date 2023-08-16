function apiGetProducts(searchValue) {
   return axios({
      url: "https://64ae4a6cc85640541d4cbf95.mockapi.io/Products",
      method: "GET",
      params: {
         name: searchValue,
      },
   });
}

function apiGetProductById(productId) {
   return axios({
      url: `https://64ae4a6cc85640541d4cbf95.mockapi.io/Products/${productId}`,
      method: "GET",
   });
}

function apiCreateProduct(product) {
   return axios({
      url: "https://64ae4a6cc85640541d4cbf95.mockapi.io/Products",
      method: "POST",
      data: product,
   });
}

function apiUpdateProduct(productId, newProduct) {
   return axios({
      url: `https://64ae4a6cc85640541d4cbf95.mockapi.io/Products/${productId}`,
      method: "PUT",
      data: newProduct,
   });
}

function apiDeleteProduct(productId) {
   return axios({
      url: `https://64ae4a6cc85640541d4cbf95.mockapi.io/Products/${productId}`,
      method: "DELETE",
   });
}
