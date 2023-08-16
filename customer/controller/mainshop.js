const SERVICES_LOCAL = {
   SET: saveLocal,
   REMOVE: removeLocal,
   GET: getLocal,
};

const STATUS = {
   FULFILL: "FULFILL",
   PENDING: "PENDING",
   REJECT: "REJECT",
};

let cartShop = SERVICES_LOCAL.GET("cartShop");

function renderBanner(...products) {
   let html = products.reduce((result, product) => {
      return (
         result +
         `
            <div class="title">
               <h1>Sản phẩm mới</h1>
               <h3>${product.name}</h3>
               <p>Thiết kế mang tính đột phá</p>
               <button class="btn-Add" onclick="addToCart(${product.id})">Add</button>
               <button onclick="showInfor(${product.id})" class="btn-Moreinfo">More Info</button>
            </div>
            <div class="banner">
               <img src="${product.img}" alt="img">
            </div>
         `
      );
   }, "");

   DOM("#carousel-content").innerHTML = html;
}

function getProducts() {
   setVisible("#loading", true);

   apiGetProducts()
      .then((respone) => {
         setVisible("#loading", false);

         renderBanner(respone.data[0]);
         display(respone.data);
      })
      .catch((error) => {
         console.log(error);
      });
}

function display(products) {
   let html = products.reduce((result, value) => {
      const product = new Product(
         value.id,
         value.name,
         +value.price,
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
        <div class="product__item col-4">
            <div class="card">
              <div class="card__top">
                <img src="${product.img}" alt="">
              </div>
              <div class="card__body">
                <div class="infor">
                  <h3>${product.name}</h3>
                  <p>$${product.price}</p>
                </div>
                <button onclick="showInfor(${product.id})" id="detail">Chi tiết</button>
                <button onclick="addToCart(${product.id})" id="add">Mua</button>
              </div>
            </div>
          </div>
        `
      );
   }, "");

   DOM("#shopProducts").innerHTML = html;
}

function initialize() {
   getProducts();
   showCart();
}

// PAGE LOADED
document.addEventListener("DOMContentLoaded", () => initialize());

function showInfor(productId) {
   $("#myModal").modal("show");
   loading("#infor", STATUS.PENDING);

   apiGetProductById(productId)
      .then((respone) => {
         loading("#infor", STATUS.FULFILL);

         let product = respone.data;

         DOM(
            "#infor"
         ).innerHTML = `<div style="animation: fadeIn; animation-duration: 0.7s">
                  <img src="${product.img}" alt=""style="width: 100px; height: 100px;"><br><br>
                  Tên sản phẩm: ${product.name}<br>
                  Giá: $${product.price}<br><br>
                  Màn hình: ${product.screen}<br>
                  Camera sau: ${product.backCamera}<br>
                  Camera trước: ${product.frontCamera}<br>
                  Miêu tả: ${product.desc}<br>
                  Loại: ${product.type}
                  </div>
                  `;

         DOM("#modal-footer").innerHTML = `
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-dark" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
                  `;
      })
      .catch((error) => {
         loading("#infor", STATUS.REJECT);
         console.log(error);
      });
}

function showCart() {
   let amount = 0;
   let total = 0;

   let html = cartShop.reduce((result, product) => {
      amount += product.quantity;
      total += product.quantity * product.price;
      return (
         result +
         `
      <tr>
        <td>
          <img src="${product.img}" alt="">${product.name}
        </td>
        <td style="text-align: center;">
            <i onclick="decQuality(${product.id})" class="fa-solid fa-caret-left"></i>
              ${product.quantity}
              <i onclick="incQuantity(${product.id})" class="fa-solid fa-caret-right"></i></td>
        <td style="text-align: center;">${product.price}</td>
        <td><i onclick="deleteCartItem(${product.id})" class="fa-solid fa-square-xmark"></i></td>
      </tr>
    `
      );
   }, "");

   DOM("#cartNoti").innerHTML = html ? "" : "Không có sản phẩm trong giỏ hàng";
   DOM("#purchase").disabled = html ? false : true;

   DOM("#amount").innerHTML = amount;
   DOM("#displayCart").innerHTML = html;
   DOM("#sumPrice").innerHTML = `Tổng giá: $${total}`;
}

function addToCart(productId) {
   apiGetProductById(productId)
      .then((respone) => {
         let product = respone.data;

         const hasProduct = cartShop.findIndex((item) => item.id == productId);

         if (hasProduct !== -1) {
            cartShop[hasProduct].quantity += 1;
         } else {
            const cartItem = { ...product, quantity: 1 };
            cartShop.push(cartItem);
         }

         showCart();
         $("#myModal").modal("hide");
         SERVICES_LOCAL.SET("cartShop", cartShop);
      })
      .catch((error) => {
         console.log(error);
      });
}

function deleteCartItem(productId) {
   cartShop = cartShop.filter((value) => value.id != productId);

   showCart();
   SERVICES_LOCAL.SET("cartShop", cartShop);
}

function incQuantity(productId) {
   let index = cartShop.findIndex((product) => product.id == productId);
   if (index === -1) {
      return;
   }

   cartShop[index].quantity += 1;
   showCart();
   SERVICES_LOCAL.SET("cartShop", cartShop);
}

function decQuality(productId) {
   let index = cartShop.findIndex((product) => product.id == productId);
   if (index === -1) {
      return;
   }

   if (cartShop[index].quantity === 1) {
      deleteCartItem(productId);
      return;
   }

   cartShop[index].quantity -= 1;
   showCart();
   SERVICES_LOCAL.SET("cartShop", cartShop);
}

function pay() {
   cartShop = [];
   showCart();
   SERVICES_LOCAL.REMOVE("cartShop");
}

function toggleCart() {
   DOM("#formCart").classList.toggle("show");
}

// HELPER
function DOM(selector) {
   return document.querySelector(selector);
}

function countDown(second) {
   return new Promise((resolve) => {
      for (let i = second; i >= 0; i--) {
         setTimeout(() => {
            DOM("#timer").innerHTML = `Sẽ quay lại trang chủ trong ${i} giây`;
         }, 1000 * Math.abs(i - second));
      }

      return setTimeout(resolve, 1000 * second);
   });
}

function delay(second, callback) {
   return new Promise((resolve) => {
      return setTimeout(() => {
         callback();
         return resolve();
      }, 1000 * second);
   });
}

function createModalComfirm() {
   const bodyEls = document.getElementsByTagName("body");
   const modal = document.createElement("div");
   const overlay = document.createElement("div");
   const content = document.createElement("div");
   const btnGroup = document.createElement("div");
   const btnComfirm = document.createElement("button");
   const btnClose = document.createElement("button");

   modal.style =
      "position: fixed; inset: 0; z-index: 9991; display: flex; justify-content: center; align-items: center; scale: 1; transition: 0.7s all";
   overlay.style = "position: absolute; inset: 0; background: rgba(0,0,0, 0.7)";
   modal.appendChild(overlay);

   content.innerHTML = `
                        <div style="margin-bottom: 30px">
                           Bấm <span style="color:red">Xác nhận</span> để hoàn tất quá trình thanh toán!
                           <p id="timer" style="font-size: 18px"></p>
                        </div>
                        `;
   content.style =
      "background: #fff; padding: 50px 30px; font-size: 20px; border-radius: 12px; color: #000; text-align: center; position: relative; z-index: 9992; scale: 1; transition: 0.7s all";
   modal.appendChild(content);

   btnComfirm.classList.add("btnConfirm");
   btnComfirm.innerHTML = "Xác nhận";

   btnClose.classList.add("btnClose");
   btnClose.innerHTML = "Đóng";

   btnGroup.appendChild(btnComfirm);
   btnGroup.appendChild(btnClose);
   content.appendChild(btnGroup);
   bodyEls[0].appendChild(modal);

   btnComfirm.onclick = () => {
      pay();
      content.innerHTML = ` <div style="margin-bottom: 30px">
                              Thanh toán thành công!
                              <p id="timer" style="font-size: 18px"></p>
                           </div>`;

      countDown(3)
         .then(() => {
            modal.style =
               "position: fixed; inset: 0; z-index: 9991; display: flex; justify-content: center; align-items: center;scale: 0; transition: 0.7s all";
            content.style =
               "background: #fff; padding: 50px 30px; font-size: 20px; border-radius: 12px; color: #000; text-align: center; position: relative; z-index: 9992; scale: 0; transition: 0.7s all";

            delay(0.9, () => modal.parentElement.removeChild(modal))
               .then(() => {
                  bodyEls[0].style = "overflow-y: auto";
               })
               .catch((err) => {
                  console.log(err);
               });
         })
         .catch((err) => {
            console.log(err);
         });
   };

   btnClose.onclick = () => {
      countDown(2)
         .then(() => {
            modal.style =
               "position: fixed; inset: 0; z-index: 9991; display: flex; justify-content: center; align-items: center;scale: 0; transition: 0.7s all";
            content.style =
               "background: #fff; padding: 50px 30px; font-size: 20px; border-radius: 12px; color: #000; text-align: center; position: relative; z-index: 9992; scale: 0; transition: 0.7s all";

            delay(0.9, () => modal.parentElement.removeChild(modal))
               .then(() => {
                  bodyEls[0].style = "overflow-y: auto";
               })
               .catch((err) => {
                  console.log(err);
               });
         })
         .catch((err) => {
            console.log(err);
         });
   };
}

// LOCALSTORAGE
function saveLocal(key, values) {
   localStorage.setItem(key, JSON.stringify(values));
}

function removeLocal(key) {
   localStorage.removeItem(key);
}

function getLocal(key) {
   return JSON.parse(localStorage.getItem(key)) || [];
}

// LOADING
function loading(selector, status) {
   if (status && status == "PENDING") {
      DOM(selector).innerHTML =
         '<div style="text-align: center; padding: 50px 0"><div class="lds-dual-ring"></div></div>';
      return;
   }

   if (status && status == "REJECT") {
      DOM(selector).innerHTML =
         '<div style="text-align:center"<p>Lỗi hệ thống! Xin vui lòng tải lại trang!</p></div>';
      return;
   }
}

function setVisible(elementOrSelector, visible) {
   (typeof elementOrSelector === "string"
      ? document.querySelector(elementOrSelector)
      : elementOrSelector
   ).style = visible ? "scale: 1; opacity: 1" : "scale: 0; opacity: 0";
}
