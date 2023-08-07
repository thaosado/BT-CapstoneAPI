getProducts()

function DOM(selector){
  return document.querySelector(selector);
}

let count = 0;

  let cartShop = JSON.parse(localStorage.getItem("cartShop"));
  if (!cartShop) {
    cartShop = []
  }
  for(let i in cartShop){
    count += cartShop[i].quality;
  }
  DOM("#count").innerHTML = count;


function getProducts() {
  apiGetProducts()
    .then((respone) => {
      display(respone.data);
    })
    .catch((error) => {
      console.log(error);
    })
};

function display(products) {
  let html = products.reduce((result, value, index) => {
    product = new Product(value.id, value.name, +value.price, value.screen, value.backCamera, value.frontCamera, value.img, value.desc, value.type);
    return (result + `
        <div class="product__item col-4">
            <div class="card">
              <div class="card__top">
                <img src="${value.img}" alt="">
              </div>
              <div class="card__body">
                <div class="infor">
                  <h3>${value.name}</h3>
                  <p>$${value.price}</p>
                </div>
                <button onclick="showInfor(${value.id})">Chi tiết</button>
                <button onclick="cart(${value.id})">Mua</button>
              </div>
            </div>
          </div>
        `)
  }, "")
  DOM("#shopProducts").innerHTML = html;
}

function showInfor(productId) {
  $('#myModal').modal('show');

  apiGetProductById(productId)
    .then((respone) => {
      let product = respone.data;
      DOM("#infor").innerHTML =
        `
        <img src="${product.img}" alt=""style="width: 100px; height: 100px;"><br><br>
        Tên sản phẩm: ${product.name}<br>
        Giá: $${product.price}<br><br>
        Màn hình: ${product.screen}<br>
        Camera sau: ${product.backCamera}<br>
        Camera trước: ${product.frontCamera}<br>
        Miêu tả: ${product.desc}<br>
        Loại: ${product.type}


        `
    })
    .catch((error) => {
      console.log(error);
    })

}


function cart(productId) {
  count++;
  DOM("#count").innerHTML = count;

  showCart()
  apiGetProductById(productId)
    .then((respone) => {
      let product = respone.data;
      product.quality = 1;

      for (let i in cartShop) {
        if (cartShop[i].id === `${productId}`) {
          cartShop[i].quality += 1;
          showCart();
          saveLocal();
          calcSumPrice()
          return
        }
      }
      cartShop.push(product)
      saveLocal()
      showCart()
      calcSumPrice()
    })
    .catch((error) => {
      console.log(error);
    })
    
}

function saveLocal() {
  localStorage.setItem("cartShop", JSON.stringify(cartShop))
}

function clickCart(){
  DOM("#formCart").classList.toggle("d-none");
  showCart()
}
function showCart() {
  
  let html = cartShop.reduce((result, value) => {

    return (result + `
      <tr>
        <td>
          <img src="${value.img}" alt="">${value.name}
        </td>
        <td style="text-align: center;">
            <i onclick="downQuality(${value.id})" class="fa-solid fa-caret-left"></i>
              ${value.quality}
              <i onclick="moreQuality(${value.id})" class="fa-solid fa-caret-right"></i></td>
        <td style="text-align: center;">${value.price}</td>
        <td><i onclick="deleteCartItem(${value.id})" class="fa-solid fa-square-xmark"></i></td>
      </tr>
    `)
  }, "")
  

  DOM("#displayCart").innerHTML = html;
  calcSumPrice();

}

function deleteCartItem(productId){

  let newCart = cartShop.filter((value) =>{
    return value.id !== `${productId}`
  })
  cartShop = newCart;
  count = cartShop.reduce((result, value) => {
    return result + value.quality;
  }, 0)

  saveLocal()
  showCart()
  DOM("#count").innerHTML = count;
  calcSumPrice()

}


function moreQuality(productId){
  for(let i in cartShop){
    if(cartShop[i].id === `${productId}`){
        cartShop[i].quality ++;
        count++;
        saveLocal()
        showCart()
    }
    DOM("#count").innerHTML = count;
    calcSumPrice()
    
  }
}

function downQuality(productId){
  for(let i in cartShop){
    if(cartShop[i].id === `${productId}`){
        cartShop[i].quality --;
        count--;
        saveLocal()
        showCart()
    }
    ("#count").innerHTML = count;
    calcSumPrice()
  }
}

function calcSumPrice(){
  let sumPrice = cartShop.reduce((result, value)=>{
    return ( result + (value.price * value.quality))
  }, 0)
  DOM("#sumPrice").innerHTML = `Tổng giá: $${sumPrice}`
}


calcSumPrice()
console.log(sumPrice);