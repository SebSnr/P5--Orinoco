
/******************* get product ID from url *******************/
    let productId = document.location.hash.replace('#', '')

/******************* get product details *******************/
const getProductDetails = () => {
    return fetch(`http://localhost:3000/api/teddies/${productId}`)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log("API issue : code ${response.status}")
                    return
                }
                return response.json()
                    .then(function(data){
                        const mainContent = document.getElementById('main-content')
                        mainContent.innerHTML = showProductDetails(data)
                    })
            } 
        )
        .catch(
            function(err) {
                console.log("fetch error", err)
            }
        )
}

const showProductDetails = (product) => {
    if (product.error) {
        console.log ("error :" , error)
    }
    return `
        <div class="row my-5 d-flex align-items-center">

            <div class="col-12 col-lg-6 mb-4 mb-lg-0">
                <img src="${product.imageUrl}" alt="photo du produit" class="img-fluid rounded shadow">
            </div>

            <div class="col-lg-1"></div>

            <div class="col-12 col-lg-4">
                <h2 class="card-title h5">${product.name}</h2>
                <span class="card-text">${product.price}</span>
                <br><br>
                <p>personnlisation</p>
                <br>
                <div class="text-center">
                    <button type="button" class="btn btn-success">
                        Add to cart 
                    </button>
                </div>
                <br><br>
                <p>${product.description}</p>
            </div>

            <div class="col-lg-1"></div>
        </div>
    `
}

getProductDetails()