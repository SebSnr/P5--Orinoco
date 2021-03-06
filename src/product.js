let category = "Teddies"
let minQuantity = 1
let maxQuantity = 20

/******************* get product details from API *******************/
// use fetch and get method for download product data from server
// if response by the server, render the result with the function
// if no response, return the error //
function getProductDetails() {
	const mainContent = document.getElementById("main-content")
	// get product id from url
	let productId = document.location.hash.replace("#", "")

	return fetch(`http://localhost:3000/api/${category}/${productId}`)
		.then(function (response) {
			if (response.status !== 200) {
				mainContent.setAttribute("class", "d-flex flex-column justify-content-center")
				mainContent.innerHTML = `<div class="text-center"><h3 classe="my-5">Cette page est introuvable</h3></div>`
				console.log(`API issue : code ${response.status}`)
				return
			}
			return response
				.json()

				.then(function (data) {
					mainContent.innerHTML = renderProductDetails(data)
					renderQuantityErrorMessage()
					document.getElementById("addCartButton").addEventListener("click", function (e) {
						e.preventDefault()
						addCart(data)
					})
				})
		})
		.catch(function (err) {
			console.log("fetch error", err)
			mainContent.setAttribute("class", "d-flex flex-column justify-content-center")
			mainContent.innerHTML = `<div class="text-center"><h3 classe="my-5">Veuillez rafraîchir la page ultérieurement. <br>Un problème est survenue lors du chargement des données.</h3></div>`
		})
}

/******************* render product page content *******************/
// create and then render the result in HTML //
// if error, return the error //
function renderProductDetails(product) {
	if (!product) {
		console.log("error : no data received from fetch")
	}

	// create the option list
	let createOptionList = (list) => {
		selectLine = ""
		for (let option in list) {
			selectLine += `<option>${list[option]}</option>`
		}
		return selectLine
	}

	return `
        <div class="row my-5 d-flex align-items-center">

            <div class="col-12 col-lg-6 mb-4 mb-lg-0">
                <img src="${product.imageUrl}" alt="photo du produit" class="img-fluid rounded shadow">
            </div>

            <div class="col-lg-1"></div>

            <div class="col-12 col-lg-4">
                <h2 class="card-title h2">${product.name}</h2>
                <span><big>${product.price / 100} €</big></span>
                <br><br>
                <select>
                    ${createOptionList(product.colors)}
                </select>
                <br><br><br>
                <table>
                    <tr>
                        <td class="col-3">
                            <label for="productName">quantité :</label>
                        </td>
                        <td class="col-1">
                        </td>
                        <td class="col-2 text-center">
                            <input type="number" class="form-control col-2" id="quantity" value="1" min="${minQuantity}" max="${maxQuantity}" oninput="validity.valid||(value=' ')" required>
                            <small id="errorMessage" class="form-text text-muted"></small>

                        </td>
                        <td class="col-1">

                        </td>
                        <td class="col-5">
                            <a href="./order.html" type="button" class="btn btn-success col-12" id="addCartButton">
                                Acheter
                            </a>
                        </td>
                    </tr>
                </table>
                <br><br>
                <p>${product.description}</p>
            </div>

            <div class="col-lg-1"></div>
        </div>
    `
}

/******************* add product to cart *******************/
// if the input quantity value is incorrect, stop the function
// if the item is already in the cart in the local storage
// remplace the quantity and total price of the item in the cart
// if no product in the cart or the item not already in
// add the product data in the local storage
function addCart(product) {
	let quantity = document.getElementById("quantity").value

	if (!document.getElementById("quantity").checkValidity()) {
		return
	}
	let totalPrice = quantity * product.price
	let cartStorage = []
	let itemNotExist = true

	// check if cart already exist in the local storage
	if (localStorage.getItem("OrinocoCart")) {
		cartStorage = JSON.parse(localStorage.getItem("OrinocoCart"))
		// check in the cart if the item is in it
		for (let i in cartStorage) {
			let item = cartStorage[i]
			if (item.name === product.name) {
				let newQuantity = parseInt(quantity) + parseInt(item.quantity)
				let newTotalPrice = parseInt(totalPrice) + parseInt(item.totalPrice)

				// if alreay in, remplace the quantity and total price of the item
				let newItem = Object.assign(cartStorage[i], {"quantity": newQuantity, "totalPrice": newTotalPrice}) // change the quantity of the item on index i in cartStorage
				Object.entries(newItem) //transform objet newItem in array
				cartStorage.splice(i, 1, newItem) // remplace the array at index i by the new one newItem
				localStorage.setItem("OrinocoCart", JSON.stringify(cartStorage))
				itemNotExist = false
			}
		}
	}
	// if the item not already in the cart, add it
	if (itemNotExist === true) {
		cartStorage.push({
			"quantity": quantity,
			"totalPrice": totalPrice,
			"Id": product._id,
			"name": product.name,
			"price": product.price,
			"imageUrl": product.imageUrl,
			"description": product.description,
		})
		localStorage.setItem("OrinocoCart", JSON.stringify(cartStorage))
	}
	window.location.href = "order.html"
}

/******************* show error in quantity value invalid *******************/
// if the in input value is invalid, render an error message
function renderQuantityErrorMessage() {
	document.getElementById("quantity").addEventListener("input", function (e) {
		if ((quantity < minQuantity) | (quantity > maxQuantity) | !document.getElementById("quantity").checkValidity()) {
			document.getElementById(`errorMessage`).innerHTML = `max ${maxQuantity}`
			return
		} else {
			document.getElementById(`errorMessage`).innerHTML = ""
		}
	})
}

// call the function when page loading
window.load = getProductDetails()
