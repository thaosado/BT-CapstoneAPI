getProducts()

function getProducts(){
    apiGetProducts()
    .then((respone) => {
        display(respone.data);
    })
    .catch((error) => {
        console.log(error);
    })
};

function display(products){
    let html = products.reduce((result, value, index) => {
        product = new Product(value.id, value.name, value.price, value.screen, value.backCamera, value.frontCamera, value.img, value.desc, value.type );
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
                <button>Mua</button>
              </div>
            </div>
          </div>
        `)
    }, "")
    document.getElementById("shopProducts").innerHTML = html;
}

function showInfor(productId){
    $('#myModal').modal('show');

    apiGetProductById(productId)
    .then((respone) => {
        let product = respone.data;
        document.getElementById("infor").innerHTML =
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

}