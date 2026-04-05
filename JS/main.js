var productNameInput = document.getElementById("productName");
var productPriceInput = document.getElementById("productPrice");
var productCategoryInput = document.getElementById("productCategory");
var productDescriptionInput = document.getElementById("productDescription");
var productImageInput = document.getElementById("productImage");

var addBtnElement = document.getElementById("addBtn");
var updateBtnElement = document.getElementById("updateBtn");

var updatedIndex;

var productList = [];

// check if we have data in localStorage
// get data in the localStorage and store it in the array
// then display again

if (localStorage.getItem("productList")) {
  productList = JSON.parse(localStorage.getItem("productList"));
  displayProducts(productList);
}
function addProduct() {
  if (
    isProductInputsValid(productRegex.productNameRegex, productNameInput) &&
    isProductInputsValid(productRegex.productPriceRegex, productPriceInput) &&
    isProductInputsValid(
      productRegex.productCategoryRegex,
      productCategoryInput
    ) &&
    isProductInputsValid(
      productRegex.productDescriptionRegex,
      productDescriptionInput
    ) &&
    isProductImageInputValid()
  ) {
    // create product
    var product = {
      name: productNameInput.value,
      price: productPriceInput.value,
      category: productCategoryInput.value,
      description: productDescriptionInput.value,
      image:
        productImageInput.files.length > 0
          ? productImageInput.files[0]?.name
          : "placeholder.png",
    };

    // then add product into the array that created [productList]
    productList.push(product);

    // then store data[array of objects ---> productList] in localStorage
    localStorage.setItem("productList", JSON.stringify(productList));

    // loop over all product and then display it
    displayProducts(productList);

    // then reset all inputs after adding product
    resetAllInputs();
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
}

function displayProducts(targetArray) {
  var cartona = "";
  for (var i = 0; i < targetArray.length; i++) {
    cartona += `
        
            <div class="col-md-6 col-lg-4 col-xl-3">
        
                <div class="card h-100">
                <img
                height="300px"
                src="./images/${targetArray[i].image}"
                class="card-img-top"
                alt="Product Image"
                />
                <div class="card-body">
                <h3 class="card-title h5"> ${targetArray[i].name} </h3>
                <p class="card-text">
                    ${targetArray[i].description}
                </p>

                <h4 class="h6">
                    <span class="fw-bold">Category:</span> ${
                      targetArray[i].category
                    }
                </h4>
                <h5 class="h6"><span class="fw-bold">Price:</span> ${
                  targetArray[i].price
                } EGP</h5>
                </div>
                <div class="card-footer">
                <button onclick="setDataToAllInputs(${
                  targetArray.length < productList.length
                    ? targetArray[i].oldIndex
                    : i
                })" class="btn btn-warning me-2">Update</button>

                <button onclick="deleteProduct(${
                  targetArray.length < productList.length
                    ? targetArray[i].oldIndex
                    : i
                })" class="btn btn-danger">Delete</button>
                </div>
            </div>
            </div>
        
        `;
  }

  document.getElementById("rowData").innerHTML = cartona;
}

function resetAllInputs() {
  productNameInput.value = "";
  productPriceInput.value = "";
  productCategoryInput.value = "";
  productDescriptionInput.value = "";
  productImageInput.value = "";

  // remove is-valid class and is-invalid class when we add product

  productNameInput.classList.remove("is-valid", "is-invalid");
  productPriceInput.classList.remove("is-valid", "is-invalid");
  productCategoryInput.classList.remove("is-valid", "is-invalid");
  productDescriptionInput.classList.remove("is-valid", "is-invalid");
  productImageInput.classList.remove("is-valid", "is-invalid");
}

function deleteProduct(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "you want to delete this product !",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      // delete from the array by specific index using splice() Method
      productList.splice(index, 1);

      // then store data[array of objects ---> productList] in localStorage after deleting
      localStorage.setItem("productList", JSON.stringify(productList));

      // loop over all product and then display it after deleting
      displayProducts(productList);

      Swal.fire({
        title: "Deleted!",
        text: "Your Product has been deleted.",
        icon: "success",
      });
    }
  });
}

function searchProduct(searchInputElement) {
  var searchValue = searchInputElement.value;

  var filteredProductList = [];

  for (var i = 0; i < productList.length; i++) {
    if (productList[i].name.toLowerCase().includes(searchValue.toLowerCase())) {
      productList[i].oldIndex = i;

      filteredProductList.push(productList[i]);
    }
  }

  displayProducts(filteredProductList);
}

function setDataToAllInputs(index) {
  updatedIndex = index;

  productNameInput.value = productList[index].name;
  productPriceInput.value = productList[index].price;
  productCategoryInput.value = productList[index].category;
  productDescriptionInput.value = productList[index].description;

  addBtnElement.classList.add("d-none");
  updateBtnElement.classList.remove("d-none");
}

function updateProduct() {
  productList[updatedIndex].name = productNameInput.value;
  productList[updatedIndex].price = productPriceInput.value;
  productList[updatedIndex].category = productCategoryInput.value;
  productList[updatedIndex].description = productDescriptionInput.value;

  if (productImageInput.files.length > 0) {
    productList[updatedIndex].image = productImageInput.files[0]?.name;
  }

  updateBtnElement.classList.add("d-none");
  addBtnElement.classList.remove("d-none");

  // then store data[array of objects ---> productList] in localStorage after editing
  localStorage.setItem("productList", JSON.stringify(productList));

  // loop over all product and then display it after editing
  displayProducts(productList);

  // then reset all inputs after adding product ---> after editing
  resetAllInputs();
}

var productRegex = {
  productNameRegex: /^[A-Z][\sa-z0-9_]{2,}$/,
  productPriceRegex: /^[1-9][0-9]{1,5}$/,
  productCategoryRegex: /^(Mobile|Headphones|Laptop|Camera|Printer|TV)$/,
  productDescriptionRegex: /^[a-z].{3,}$/,
};

function isProductInputsValid(regex, productInputElement) {
  if (regex.test(productInputElement.value)) {
    productInputElement.classList.add("is-valid");
    productInputElement.classList.remove("is-invalid");

    productInputElement.nextElementSibling.classList.replace(
      "d-block",
      "d-none"
    );

    return true;
  } else {
    productInputElement.classList.add("is-invalid");
    productInputElement.classList.remove("is-valid");

    productInputElement.nextElementSibling.classList.replace(
      "d-none",
      "d-block"
    );

    return false;
  }
}

function isProductImageInputValid() {
  if (productImageInput.files.length > 0) {
    productImageInput.classList.add("is-valid");
    productImageInput.classList.remove("is-invalid");

    productImageInput.nextElementSibling.classList.replace("d-block", "d-none");

    return true;
  } else {
    productImageInput.classList.add("is-invalid");
    productImageInput.classList.remove("is-valid");

    productImageInput.nextElementSibling.classList.replace("d-none", "d-block");

    return false;
  }
}
