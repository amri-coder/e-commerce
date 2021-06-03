/* ==================== MANAGE DISPLAY OF CATEGORIES (vélo homme, femme, enfant) ON INDEX PAGE ========================= */

// Get in the navbar all the links to the categories and put an event listener on each of them (links are disguised as buttons).
// When a link is clicked, the link is passed as a parameter to displayCategory function.
let categoryLinks = document.querySelectorAll('header .categories a');
categoryLinks.forEach(a => {
    a.addEventListener('click', () => displayCategory(a));
});

/**
 * Function to display the category linked to the associated link. 
 * When a link is clicked, the class 'displayed' is added to it and to the linked category in main section.
 * The CSS properties attached to the class permit to display the category.
 * 
 * @param a the 'a' element (link disguised as a button) linked to a category
 * 
 */
function displayCategory(a) {
    // Get the parent of the link clicked.   
    let li = a.parentNode;

    // If the link was already selected, no processing and exit of the function. 
    if (li.classList.contains('displayed')) {
        return false;
    }

    // IN THE NAVBAR:
    // The class 'displayed' is removed from the link previously selected.   
    document.querySelector('.categories .displayed').classList.remove('displayed');

    // The class 'displayed' is added to the clicked link. 
    li.classList.add('displayed');

    // IN THE MAIN SECTION:
    // The class 'displayed' is removed from the category previously selected.   
    document.querySelector('.category.displayed').classList.remove('displayed');

    // The class 'displayed' is added to the category linked to the clicked link.
    document.querySelector(a.getAttribute('href')).classList.add('displayed');
}

/* ================================================ MANAGE CART ============================================================ */

// Data loaded from a JSON with AJAX.
let products;
let ourRequest = new XMLHttpRequest();
ourRequest.open('GET', '../data.json');
ourRequest.onload = () => {
    // Parse the JSON file into JS objects and get an array of products.
    products = JSON.parse(ourRequest.responseText);
};
ourRequest.send();

// Get all the cart's buttons to add articles in it.
let addToCartButtons = document.querySelectorAll('.get-btn');

// Get all buy now buttons to add to cart and display cart modal
let buyNowButtons = document.querySelectorAll('.buy-btn');

// Add an event listener on each button to add to cart.
for (let i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener('click', () => {
        cartCounter(products[i]);
        totalCost(products[i]);        
    })
}

// Add an event listener on each buy now buttons
for (let i = 0; i < buyNowButtons.length; i++) {
    buyNowButtons[i].addEventListener('click', () => {       
        cartCounter(products[i]);
        totalCost(products[i]);
        displayCart();
    })
}

/**
 * Check if cart contains products and display on index page the number of items.
 */
function onLoadCartCounter() {
    let productsQuantity = localStorage.getItem('cartCounter');

    if (productsQuantity) {
        document.querySelector('.cart .items-counter').textContent = productsQuantity;
    }
}

/**
 * Increment by one the counter when a product is added in the cart and display it on index page.
 * 
 * @param product 
 */
function cartCounter(product) {
    let productsQuantity = localStorage.getItem('cartCounter');
    productsQuantity = parseInt(productsQuantity);

    if (productsQuantity) {
        localStorage.setItem('cartCounter', productsQuantity + 1);
        document.querySelector('.cart .items-counter').textContent = productsQuantity + 1;
    } else {
        localStorage.setItem('cartCounter', 1);
        document.querySelector('.cart .items-counter').textContent = 1;
    }

    addToJson(product);
}

/**
 * Add product in a JSON file stored in browser's local storage when added in cart.
 * 
 * @param product 
 */
function addToJson(product) {
    // Get local storage JSON.
    let productsInCart = localStorage.getItem('productsInCart');
    // Convert the JSON into a JS object.
    productsInCart = JSON.parse(productsInCart);     

    // Check if JSON exists.
    if (productsInCart != null) {      
        // Check with the id of the product if it is already in the cart.              
        if (productsInCart[product.id] == undefined) {          
            productsInCart = {
                ...productsInCart,
                [product.id]: product                
            };                                     
        }          
        // If there is at least one same type of product, add 1 to product's inCart value.
        productsInCart[product.id].inCart = parseInt(productsInCart[product.id].inCart) + 1;                
       
    // If the cart is empty.
    } else {      
        product.inCart = 1;  
        productsInCart = {
            [product.id]: product
        }; 
    }
    // Convert into JSON.
    localStorage.setItem('productsInCart', JSON.stringify(productsInCart));

    // réinitialisation product.inCart
    product.inCart = 0;
}

/**
 * Compute the total price of the items in the cart.
 * 
 * @param product 
 */
function totalCost(product) {
    // Get the total price before to add a new item.
    let cartCost = localStorage.getItem('totalCost');

    if (cartCost != null) {        
        cartCost = parseFloat(cartCost);
        cartCost +=  parseFloat(product.price);
        cartCost = cartCost.toFixed(2);
        localStorage.setItem('totalCost', cartCost);
    } else {        
        localStorage.setItem('totalCost', product.price);
    }

}

// Add an event listener on the cart icon to display the content of the cart after a click.
document.querySelector('.cart a').addEventListener('click', displayCart);

/**
 * Display the content of the cart in a modal window.
 */
function displayCart() {
    // Get JSON from local storage and parse it.
    let productsInCart = localStorage.getItem('productsInCart');
    productsInCart = JSON.parse(productsInCart);
    // Get HTML element where to display the items added in the cart.
    let productContainer = document.querySelector('.products');
    // Get total cost.
    let cartCost = localStorage.getItem('totalCost');

    if (productsInCart && productContainer) {
        productContainer.innerHTML = '';
        Object.values(productsInCart).map(item => {
            productContainer.innerHTML += `              
                <tr class="text-center">
                    <td scope="row">${item.id}</th>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td> ${parseInt(item.inCart)}</td>
                    <td><button class="cartAddButton btn btn-outline-info btn-sm"><i class="fas fa-plus"></i></button></td>
                    <td><button class="cartRemoveButton btn btn-outline-danger btn-sm"><i class="fas fa-minus"></i></button></td>
                    <td>${(parseInt(item.inCart) * parseFloat(item.price)).toFixed(2)}</td>
                </tr>              
                `;
        });
        productContainer.innerHTML += `
            <tfoot>
                <tr class="fw-bold text-center">
                    <td colspan="4">TOTAL</td>
                    <td colspan="3">${(parseFloat(cartCost)).toFixed(2)}€</td>
                </tr>
            </tfoot>       
        `;
    } else {
        productContainer.innerHTML = '';
    }

    // Get all add item buttons of the cart and add an event listener.
    let addItemButtons = document.querySelectorAll('table .cartAddButton');
    addItemButtons.forEach(button => button.addEventListener('click', addItem));

    // Get all remove item buttons of the cart and add an event listener.
    let removeItemButtons = document.querySelectorAll('table .cartRemoveButton');
    removeItemButtons.forEach(button => button.addEventListener('click', removeItem));

}

/**
 * Add an item in the cart when plus sign button is hit in the cart's modal window.
 * 
 * @param e event
 */
function addItem(e) {
    // Get the product id in the cart's table.
    let id = e.currentTarget.parentElement.parentElement.firstElementChild.innerText;
    // Increment counter and total cost.
    cartCounter(products[id]);
    totalCost(products[id]);
    // Refresh cart.
    displayCart();
}

/**
 * Remove an item from the cart when plus minus button is hit in the cart's modal window.
 * 
 * @param e event
 */
function removeItem(e) {
    // Get the product id in the cart's table.
    let id = e.currentTarget.parentElement.parentElement.firstElementChild.innerText;
    let product = products[id];
    // Update local storage variables and parse JSON file.
    let productsQuantity = localStorage.getItem('cartCounter');
    let cartCost = localStorage.getItem('totalCost');
    let productsInCart = localStorage.getItem('productsInCart');    
    productsInCart = JSON.parse(productsInCart);

    // Remove item from cart if there is at least one.
    if (productsQuantity > 0 && productsInCart[product.id].inCart > 0) {
        // Remove one unit from cartCounter in localStorage.                  
        localStorage.setItem('cartCounter', productsQuantity - 1);
        // Remove one unit from the cart counter on the index page.
        document.querySelector('.cart .items-counter').textContent = productsQuantity - 1;
        // If there is at least one same type of product, remove one from inCart.       
        productsInCart[product.id].inCart = parseInt(productsInCart[product.id].inCart) - 1;        
              
        // Delete item from productsInCart if inCart property equals 0. 
        if(productsInCart[product.id].inCart == 0){                                 
            delete productsInCart[product.id];
        } 
        
        // Convert into JSON.
        localStorage.setItem('productsInCart', JSON.stringify(productsInCart));

        // Manage the total.
        if (cartCost != null) {            
            cartCost = parseFloat(cartCost);
            cartCost -= parseFloat(product.price);
            cartCost = cartCost.toFixed(2);
            localStorage.setItem('totalCost', cartCost);
        }

        // Remove variable productsInCart from localStorage.
        if (productsQuantity == 1) {            
            localStorage.clear();
        }  
        
    }
    // Refresh cart.
    displayCart();
}

//***************** Button to clear out the cart ***********//

// Get 'Vider le panier' button.
document.getElementById('delete').addEventListener("click", resetCart);

/**
 * Clear out the cart.
 */
function resetCart() {
    localStorage.removeItem("productsInCart");
    localStorage.removeItem("totalCost");
    //localStorage.removeItem("cartCounter");

    // Reset counter variable in local storage and its display.
    localStorage.setItem('cartCounter', 0);
    document.querySelector('.cart .items-counter').textContent = 0;
    // Refresh cart.
    displayCart();
}

//************************ Button 'passer la commande' *********************//

// Open modal window for payment when 'passer la commande' button is clicked.
document.getElementById('button-modal').addEventListener('click', function () {
    document.getElementById('totalPrix').textContent = localStorage.getItem('totalCost');
})


// Get items in the cart count on page loading.
onLoadCartCounter();