/* =============== GESTION DE L'AFFICHAGE DES CATEGORIES DE VELOS (homme, femme, enfant) SUR LA PAGE INDEX ================================== */

// On récupère l'ensemble des liens déguisés en bouton (a) et on applique un écouteur d'évènement sur chacun.
// Lorsque l'un d'eux est cliqué, on le passe en paramètre de la fonction displayCategory.
let categoryLinks = document.querySelectorAll('header .categories a');
categoryLinks.forEach(a => {
    a.addEventListener('click', () => displayCategory(a));
});


/**
 * Fonction qui permet d'afficher la rubrique associée au bouton cliqué
 * 
 * @param a  l'élément 'a' (lien déguisé en bouton du header) qui fait le lien vers une catégorie (Vélos Homme, Vélos Femme, Vélos Enfant)
 * 
 */
function displayCategory(a) {
    // On récupère l'élément parent du lien qui a été cliqué
    let li = a.parentNode;

    // Si le lien était déjà sélectionné, pas de traitement. On sort de la fonction.
    if (li.classList.contains('displayed')) {
        return false
    }

    // On retire la classe displayed du bouton qui était précédemment sélectionné
    document.querySelector('.categories .displayed').classList.remove('displayed');

    // On ajoute la classe displayed au bouton qui vient d'être cliqué
    li.classList.add('displayed');

    // On retire la class displayed sur la rubrique qui était précédemment sélectionné
    document.querySelector('.category.displayed').classList.remove('displayed');

    // On ajoute la class displayed sur la rubrique correspondant au bouton cliqué
    document.querySelector(a.getAttribute('href')).classList.add('displayed');

}

/* =============================================== GESTION DU PANIER ===================================== */

// Data loaded from a JSON with AJAX
let products;
let ourRequest = new XMLHttpRequest();
ourRequest.open('GET', '../data.json');
ourRequest.onload = () => {
    products = JSON.parse(ourRequest.responseText);
};
ourRequest.send();

// Get the all the carts buttons to add to cart
let addToCartButtons = document.querySelectorAll('.get-btn');

// Add an event listener on each add to cart button
for (let i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener('click', () => {
        console.log("prod: " + products[i])
        cartNumbers(products[i]);
        totalCost(products[i]);
    })
}

// Check if cart contains products and display the numbers of items
function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');

    if (productNumbers) {
        document.querySelector('.cart .items-counter').textContent = productNumbers;
    }
}

// Count the number of items added to the cart
function cartNumbers(product) {
    let productNumbers = localStorage.getItem('cartNumbers');

    productNumbers = parseInt(productNumbers);

    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart .items-counter').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart .items-counter').textContent = 1;
    }

    setItems(product);
}

// Add the different products in the cart (product), with their name (product.name) and number (product.inCart)
function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    // Convert the JSON into a JavaScript object
    cartItems = JSON.parse(cartItems);

    // Check if if cart already contains items
    if (cartItems != null) {
        // Check with the name of the product if it is already in the cart
        if (cartItems[product.id] == undefined) {
            cartItems = {
                ...cartItems,
                [product.id]: product
            }
        }
        // If there is at least one same type of product, add 1 to inCart
        cartItems[product.id].inCart = parseInt(cartItems[product.id].inCart) + 1;
        // If the cart is empty
    } else {
        product.inCart = 1;
        cartItems = {
            [product.id]: product
        }
    }

    // Convert into JSON
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

// Compute the total price of the items in the cart
function totalCost(product) {
    // Get the total price before to add a new item
    let cartCost = localStorage.getItem('totalCost');

    if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost + parseInt(product.price));
    } else {
        localStorage.setItem('totalCost', parseInt(product.price));
    }

}

// Add an event listener on the cart icon to display the content of the cart after a click
document.querySelector('.cart a').addEventListener('click', displayCart);

// Display the content of the cart
function displayCart() {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector('.products');
    let cartCost = localStorage.getItem('totalCost');

    if (cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `              
                <tr class="text-center">
                    <td scope="row">${item.id}</th>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td> ${parseInt(item.inCart)}</td>
                    <td><button class="cartAddButton btn btn-outline-info btn-sm"><i class="fas fa-plus"></i></button></td>
                    <td><button class="cartRemoveButton btn btn-outline-danger btn-sm"><i class="fas fa-minus"></i></button></td>
                    <td>${parseInt(item.inCart) * parseInt(item.price)}</td>
                </tr>              
                `;
        });

        productContainer.innerHTML += `
            <tfoot>
                <tr class="fw-bold text-center">
                    <td colspan="4">TOTAL</td>
                    <td colspan="3">${parseInt(cartCost)}€</td>
                </tr>
            </tfoot>       
        `;
    } else {
        productContainer.innerHTML = '';
    }

    // // Get all add item buttons of the cart and add an event listener
    let addItemButtons = document.querySelectorAll('table .cartAddButton');
    addItemButtons.forEach(button => button.addEventListener('click', addItem));

    // // Get all remove item buttons of the cart and add an event listener
    let removeItemButtons = document.querySelectorAll('table .cartRemoveButton');
    removeItemButtons.forEach(button => button.addEventListener('click', removeItem));

}


// Add an item in the cart
function addItem(e) {
    let id = e.currentTarget.parentElement.parentElement.firstElementChild.innerText;             
    cartNumbers(products[id]);
    totalCost(products[id]);
    displayCart();
}

// Remove an item from the cart
function removeItem(e) {
    let id = e.currentTarget.parentElement.parentElement.firstElementChild.innerText;
    let product = products[id];
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartCost = localStorage.getItem('totalCost');
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    // Remove item from cart if there is at leat one
    if (productNumbers > 0 && cartItems[product.id].inCart > 0) {
        // Remove one unit from cartNumbers in localStorage                  
        localStorage.setItem('cartNumbers', productNumbers - 1);
        // Remove one unit from the cart counter on the index webpage
        document.querySelector('.cart .items-counter').textContent = productNumbers - 1;
        // If there is at least one same type of product, remove one from inCart       
        cartItems[product.id].inCart = parseInt(cartItems[product.id].inCart) - 1;
        localStorage.setItem('productsInCart', JSON.stringify(cartItems));

        // Manage the total
        if (cartCost != null) {
            cartCost = parseInt(cartCost);
            localStorage.setItem('totalCost', cartCost - parseInt(product.price));
        } 

        // Remove variable productsInCart from localStorage
        if (productNumbers == 1) {
            localStorage.removeItem('productsInCart');
        }

    }
    displayCart();
}


onLoadCartNumbers();
displayCart();

//*****************le button pour vider entièrement  le panier***********//


   
    document.getElementById('delete').addEventListener("click", resetCart);

    function resetCart(){
    
    localStorage.removeItem("productsInCart");
    localStorage.removeItem("totalCost");
    //localStorage.removeItem("cartNumbers");
    
    localStorage.setItem('cartNumbers',0);
    document.querySelector('.cart .items-counter').textContent=0;
    
    

    displayCart();
    


}

//************************button passer la commande *********************//
