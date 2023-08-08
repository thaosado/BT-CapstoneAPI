getProducts();
isSubmit = false;

function DOM(selector){
    return document.querySelector(selector);
}

function getProducts(){
    apiGetProducts()
    .then((respone) => {
        display(respone.data);
    })
    .catch((error) => {
        console.log(error);
    })
};

function createProduct(){
    isSubmit = true;
    let product = validation();
    if(!product){
        return
    }
    
    apiCreateProduct(product)
    .then((respone)=>{
        return apiGetProducts()
    })
    .then((respone)=>{
        display(respone.data);
        $("#myModal").modal("hide");
        reset()
    })
    .catch((error)=>{
        console.log(error)
    })

    
}

function selectProduct(productId){
    $("#myModal").modal("show");
    DOM(".modal-title").innerHTML = "Cập nhật sản phẩm";
    DOM(".modal-footer").innerHTML = `
    <button class ="btn btn-secondary" data-dismiss = "modal" onclick="reset()">Hủy</button>
        <button class ="btn btn-success" onclick = "updateProduct('${productId}')">Cập nhật</button>
    `

    apiGetProductById(productId)
    .then((respone) => {
        let product = respone.data;
        DOM("#TenSP").value = product.name;
        DOM("#GiaSP").value = product.price;
        DOM("#screen").value = product.screen;
        DOM("#frontCamera").value = product.frontCamera;
        DOM("#backCamera").value = product.backCamera;
        DOM("#imgSP").value = product.img;
        DOM("#descSP").value = product.desc;
        DOM("#loaiSP").value = product.type;
    })
    .catch((error)=>{
        console.log(error)
    })
}

function updateProduct(productId){
    let newProduct = validation()
    if(!newProduct){
        return
    }
    apiUpdateProduct(productId, newProduct)
    .then(()=>{
        return apiGetProducts()
    })
    .then((respone)=>{
        display(respone.data);
        $("#myModal").modal("hide");
    })
    .catch((error)=>{
        console.log(error)
    })

    reset()
}

function deleteProduct(productId){
    apiDeleteProduct(productId)
    .then((respone)=>{
        return apiGetProducts()
    })
    .then((respone)=>{
        display(respone.data)
    })
    .catch((error)=>{
        console.log(error)
    })
}

function display(products){
    let html = products.reduce((result, value, index) => {
        product = new Product(value.id, value.name, value.price, value.screen, value.backCamera, value.frontCamera, value.img, value.desc, value.type );
        return (result + `
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
                    <button style ="width: 55px" class ="btn btn-outline-secondary mb-2" onclick="selectProduct(${product.id})">Sửa</button></button>
                    <button style ="width: 55px" class ="btn btn-dark" onclick="deleteProduct(${product.id})">Xóa</button>    
                </td>
          </tr>
        `)
    }, "")
    DOM("#productsList").innerHTML = html;
}


DOM("#inputSearch").onkeypress = (event) =>{
    if(event.key != "Enter"){
        return
    }
    apiGetProducts(event.target.value)
    .then((respone)=>{
        display(respone.data)
    })
    .catch((error)=>{
        console.log(error)
    })
}


function sortFromMin(){
    apiGetProducts()
    .then((respone)=>{
        return respone.data.sort((a,b)=>{
            return a.price - b.price
        })
    })
    .then((respone)=>{
        return display(respone)
    })
    .catch((error)=>{
        console.log(error)
    })
}

function sortFromMax(){
    apiGetProducts()
    .then((respone)=>{
        return respone.data.sort((a,b)=>{
            return b.price - a.price
        })
    })
    .then((respone)=>{
        return display(respone)
    })
    .catch((error)=>{
        console.log(error)
    })
    
}

let sortValue = DOM("#inputSort").value;
DOM("#inputSort").onchange = (event) =>{
    if(event.target.value === "fromMin"){
        sortFromMin()
    }
    if(event.target.value === "fromMax"){
        sortFromMax()
    }
    if(event.target.value === ""){
        apiGetProducts()
    .then((respone)=>{
        return display(respone.data)
    })
    .catch((error)=>{
        console.log(error)
    })
    }
    console.log(event.target.value)
}

function validation(){
    let name = DOM("#TenSP").value;
    let price = DOM("#GiaSP").value;
    let screen = DOM("#screen").value;
    let frontCamera = DOM("#frontCamera").value;
    let backCamera = DOM("#backCamera").value;
    let img = DOM("#imgSP").value;
    let desc = DOM("#descSP").value;
    let type = DOM("#loaiSP").value;

    let isValid = true;
    
    if(!isRequired(name)){
        isValid = false;
        DOM("#spanName").innerHTML = "Tên sản phẩm không được để trống";
    }else{
        DOM("#spanName").innerHTML = "";
    }
    if(!isRequired(price)){
        isValid = false;
        DOM("#spanPrice").innerHTML = "Giá sản phẩm không được để trống";
    }else if(!isPrice(price)){
        isValid = false;
        DOM("#spanPrice").innerHTML = "Giá sản phẩm phải là số";
    }else{
        DOM("#spanPrice").innerHTML = "";
    }
    if(!isRequired(screen)){
        isValid = false;
        DOM("#spanScreen").innerHTML = "Màn hình sản phẩm không được để trống";
    }else{
        DOM("#spanScreen").innerHTML = "";
    }
    if(!isRequired(frontCamera)){
        isValid = false;
        DOM("#spanFrontCam").innerHTML = "Camera trước của sản phẩm không được để trống";
    }else{
        DOM("#spanFrontCam").innerHTML = "";
    }
    if(!isRequired(backCamera)){
        isValid = false;
        DOM("#spanBackCam").innerHTML = "Camera sau của sản phẩm không được để trống";
    }else{
        DOM("#spanBackCam").innerHTML = "";
    }
    if(!isRequired(img)){
        isValid = false;
        DOM("#spanImg").innerHTML = "Ảnh sản phẩm không được để trống";
    }else{
        DOM("#spanImg").innerHTML = "";
    }
    if(!isRequired(desc)){
        isValid = false;
        DOM("#spanDesc").innerHTML = "Miêu tả sản phẩm không được để trống";
    }else{
        DOM("#spanDesc").innerHTML = "";
    }
    if(!isRequired(type)){
        isValid = false;
        DOM("#spanType").innerHTML = "Loại sản phẩm không được để trống";
    }else{
        DOM("#spanType").innerHTML = "";
    }
    if(isValid){
        let product = {
            name: name,
            price: +price,
            screen: screen,
            frontCamera: frontCamera,
            backCamera: backCamera,
            img: img,
            desc: desc,
            type: type,
        }
        return product
    }
    return undefined

}
function isPrice(value){
    if(isNaN(value)){
        return false
    }
    return true;
}

function isRequired(value){
    if(!value.trim()){
        return false;
    }
    return true;
}

function reset(){
    DOM("#TenSP").value = "";
    DOM("#GiaSP").value = "";
    DOM("#screen").value = "";
    DOM("#frontCamera").value = "";
    DOM("#backCamera").value = "";
    DOM("#imgSP").value = "";
    DOM("#descSP").value = "";
    DOM("#loaiSP").value = "";

    DOM("#spanName").innerHTML = "";
    DOM("#spanPrice").innerHTML = "";
    DOM("#spanScreen").innerHTML = "";
    DOM("#spanFrontCam").innerHTML = "";
    DOM("#spanBackCam").innerHTML = "";
    DOM("#spanImg").innerHTML = "";
    DOM("#spanDesc").innerHTML = "";
    DOM("#spanType").innerHTML = "";
}

