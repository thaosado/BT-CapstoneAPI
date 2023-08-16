function getProducts() {
   apiGetProducts()
      .then((respone) => {
         display(respone.data);
      })
      .catch((error) => {
         console.log(error);
      });
}
getProducts();

function createProduct() {
   let product = validation();
   if (!product) {
      return;
   }

   apiCreateProduct(product)
      .then(() => {
         return apiGetProducts();
      })
      .then((respone) => {
         display(respone.data);
         $("#myModal").modal("hide");
         reset();
      })
      .catch((error) => {
         console.log(error);
      });
}

function selectProduct(productId) {
   reset();
   $("#myModal").modal("show");

   DOM(".modal-title").innerHTML = "Cập nhật sản phẩm";
   DOM(".modal-footer").innerHTML = `
    <button class ="btn btn-secondary" data-dismiss="modal">Hủy</button>
        <button class ="btn btn-success" onclick = "updateProduct('${productId}')">Cập nhật</button>
    `;

   apiGetProductById(productId)
      .then((respone) => {
         let product = respone.data;
         DOM("#TenSP").value = product.name;
         DOM("#GiaSP").value = product.price;
         DOM("#Screen").value = product.screen;
         DOM("#FrontCamera").value = product.frontCamera;
         DOM("#BackCamera").value = product.backCamera;
         DOM("#ImgSP").value = product.img;
         DOM("#DescSP").value = product.desc;
         DOM("#LoaiSP").value = product.type;
      })
      .catch((error) => {
         console.log(error);
      });
}

function updateProduct(productId) {
   let newProduct = validation();
   if (!newProduct) {
      return;
   }

   apiUpdateProduct(productId, newProduct)
      .then(() => {
         return apiGetProducts();
      })
      .then((respone) => {
         display(respone.data);
         $("#myModal").modal("hide");
      })
      .catch((error) => {
         console.log(error);
      });

   reset();
}

function deleteProduct(productId) {
   apiDeleteProduct(productId)
      .then(() => {
         return apiGetProducts();
      })
      .then((respone) => {
         display(respone.data);
      })
      .catch((error) => {
         console.log(error);
      });
}

function display(products) {
   let html = products.reduce((result, value, index) => {
      product = new Product(
         value.id,
         value.name,
         value.price,
         value.screen,
         value.backCamera,
         value.frontCamera,
         value.img,
         value.desc,
         value.type
      );
      return (
         result +
         `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.screen}</td>
            <td>${product.backCamera}</td>
            <td>${product.frontCamera}</td>
            <td>
            <img src="${product.img}" width="100px" height="100px"/>
            </td>
            <td>${product.desc}</td>
            <td>${product.type}</td>
            <td>
                    <button style ="width: 55px" class ="btn btn-outline-secondary mb-2" onclick="selectProduct(${
                       product.id
                    })">Sửa</button></button>
                    <button style ="width: 55px" class ="btn btn-dark" onclick="deleteProduct(${
                       product.id
                    })">Xóa</button>    
                </td>
          </tr>
        `
      );
   }, "");
   DOM("#productsList").innerHTML = html;
}

// SEARCH
DOM("#inputSearch").onkeypress = debounce((event) => {
   if (event.key != "Enter") {
      return;
   }
   apiGetProducts(event.target.value)
      .then((respone) => {
         display(respone.data);
      })
      .catch((error) => {
         console.log(error);
      });
}, 1500);

// SORT
function sortFromMin() {
   apiGetProducts()
      .then((respone) => {
         let products = respone.data;
         products.sort((a, b) => {
            return a.price - b.price;
         });

         display(products);
      })
      .catch((error) => {
         console.log(error);
      });
}

function sortFromMax() {
   apiGetProducts()
      .then((respone) => {
         let products = respone.data;
         products.sort((a, b) => {
            return b.price - a.price;
         });

         display(products);
      })
      .catch((error) => {
         console.log(error);
      });
}

DOM("#inputSort").onchange = debounce((event) => {
   if (event.target.value === "fromMin") {
      sortFromMin();
   }
   if (event.target.value === "fromMax") {
      //   sortFromMax();
   }
   if (event.target.value === "") {
      apiGetProducts()
         .then((respone) => {
            return display(respone.data);
         })
         .catch((error) => {
            console.log(error);
         });
   }
   console.log(event.target.value);
}, 1500);

// RESET FORM
function reset() {
   DOM("#TenSP").value = "";
   DOM("#GiaSP").value = "";
   DOM("#Screen").value = "";
   DOM("#FrontCamera").value = "";
   DOM("#BackCamera").value = "";
   DOM("#ImgSP").value = "";
   DOM("#DescSP").value = "";
   DOM("#LoaiSP").value = "";

   DOM("#spanTenSP").innerHTML = "";
   DOM("#spanGiaSP").innerHTML = "";
   DOM("#spanScreen").innerHTML = "";
   DOM("#spanFrontCamera").innerHTML = "";
   DOM("#spanBackCamera").innerHTML = "";
   DOM("#spanImgSP").innerHTML = "";
   DOM("#spanDescSP").innerHTML = "";
   DOM("#spanLoaiSP").innerHTML = "";
}

// VALIDATE
function isPrice(value) {
   if (isNaN(value)) {
      return false;
   }
   return true;
}

function isRequired(value) {
   if (!value.trim()) {
      return false;
   }
   return true;
}

function validation() {
   let product = {
      name: DOM("#TenSP").value,
      price: DOM("#GiaSP").value,
      screen: DOM("#Screen").value,
      frontCamera: DOM("#FrontCamera").value,
      backCamera: DOM("#BackCamera").value,
      img: DOM("#ImgSP").value,
      desc: DOM("#DescSP").value,
      type: DOM("#LoaiSP").value,
   };

   let isValid = true;
   for (const key in product) {
      if (!isRequired(product[key])) {
         isValid = false;
         errorMsg(
            `#span${PRODUCT_ID[key]}`,
            `${PRODUCTID_DESC[key]} sản phẩm không được để trống!`
         );
      } else {
         errorMsg(`#span${PRODUCT_ID[key]}`, "");
      }

      if (product[key] && PRODUCT_ID[key] === "GiaSP") {
         if (!isPrice(product[key])) {
            isValid = false;
            errorMsg(
               `#span${PRODUCT_ID[key]}`,
               `${PRODUCTID_DESC[key]} sản phẩm phải là số!`
            );
         }
      }
   }

   if (!isValid) {
      return;
   }

   return { ...product, price: product.price * 1 };
}

// Toggle modal
DOM("#btnAddProduct").onclick = () => {
   reset();
   DOM(".modal-title").innerHTML = "Thêm sản phẩm mới";
   DOM(".modal-footer").innerHTML = `
        <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
        <button class="btn btn-success" onclick ="createProduct()">Thêm</button>
        `;
};

// HELPER
function DOM(selector) {
   return document.querySelector(selector);
}

function debounce(fn, ms) {
   let timer;

   return function () {
      const args = arguments;
      const context = this;

      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
         fn.apply(context, args);
      }, ms);
   };
}

function errorMsg(id, msg) {
   DOM(id).innerHTML = msg;
}

// CONST
const PRODUCT_ID = {
   name: "TenSP",
   price: "GiaSP",
   img: "ImgSP",
   type: "LoaiSP",
   screen: "Screen",
   backCamera: "BackCamera",
   frontCamera: "FrontCamera",
   desc: "DescSP",
};

const PRODUCTID_DESC = {
   name: "Tên",
   price: "Giá",
   img: "Ảnh",
   type: "Loại",
   screen: "Màn hình",
   backCamera: "Camera sau",
   frontCamera: "Camera trước",
   desc: "Miêu tả",
};
