let cartTemplateHTML = 
`<div class="cart-item cart-column">
    <img class="cart-item-image" src="" width="100" height="100">
        <span class="cart-item-title"></span>
</div>
<span class="cart-price cart-column"></span>
<div class="cart-quantity cart-column">
    <input class="cart-quantity-input" type="number" value="1">
    <button class="btn btn-danger" type="button">REMOVE</button>
</div>`;

let format = new Intl.NumberFormat('en-us', {style: 'currency', currency: 'USD'})

let cart = document.getElementsByClassName("cart-items")[0];
let itemList = cart.children;

let addToCartBtns = document.getElementsByClassName("shop-item-button");

//add onclick function to each shop item on the page:
for(let i = 0; i < addToCartBtns.length; i++)
{
    addToCartBtns[i].onclick = () => {addToCart(addToCartBtns[i])};
}

//add onclick function to each item in the cart
for(let i = 0; i < itemList.length; i++)
{
    itemList[i].getElementsByClassName("btn-danger")[0].onclick = () => {removeItem(itemList[i])};
}

//add onclick to purchase button
document.getElementsByClassName("btn-purchase")[0].onclick = () => {clearCart()};

//add onfocus and onchange to quantities in cart
for(let i = 0; i < itemList.length; i++)
{
    let itemQuantity = itemList[i].getElementsByClassName("cart-quantity-input")[0]
    itemQuantity.onfocus = () => {storeValue(itemQuantity)}
    itemQuantity.onchange = () => {updatePrice(itemQuantity)}
}

//set initial cart prices based on initial quantities
for(let i = 0; i<itemList.length; i++)
{
    let price = Number(itemList[i].getElementsByClassName("cart-price")[0].innerText.slice(1))
    let quantity = Number(itemList[i].getElementsByClassName("cart-quantity-input")[0].value)
    let totalPrice = price * quantity;
    itemList[i].getElementsByClassName("cart-price")[0].innerText = `$${totalPrice}`
}

function addToCart(item)
{
    if(isInCart(item))
    {
        alert("Item is already in cart!");
        return;
    }

    //get item info from shop item object
    let itemName = item.parentNode.parentNode.getElementsByClassName("shop-item-title")[0].innerText;
    let itemImg = item.parentNode.parentNode.getElementsByClassName("shop-item-image")[0].src;
    let itemPrice = item.parentNode.getElementsByClassName("shop-item-price")[0].innerText;

    //create blank cart item
    let newCartItem = document.createElement("div");
    newCartItem.className = "cart-row"
    newCartItem.innerHTML = cartTemplateHTML

    //add info to cart item object from the shop item object
    newCartItem.getElementsByClassName("cart-item-title")[0].innerText = itemName;
    newCartItem.getElementsByClassName("cart-price")[0].innerText = itemPrice;
    newCartItem.getElementsByClassName("cart-item-image")[0].src = itemImg;

    newCartItem.getElementsByClassName("btn-danger")[0].onclick = () => {removeItem(newCartItem)};
    let itemQuantity = newCartItem.getElementsByClassName("cart-quantity-input")[0]
    itemQuantity.onfocus = () => {storeValue(itemQuantity)}
    itemQuantity.onchange = () => {updatePrice(itemQuantity)}

    cart.appendChild(newCartItem);
    updateCartTotal()

}

function isInCart(item)
{
    let itemName = item.parentNode.parentNode.getElementsByClassName("shop-item-title")[0].innerText;

    for(let i = 0; i<itemList.length; i++)
    {
        let listItemName = itemList[i].getElementsByClassName("cart-item-title")[0].innerText;
        if(listItemName === itemName)
        {
            return true;
        }
    }
    return false;
}

function removeItem(item)
{
    item.remove();

    //for some reason, removing things in a certain order causes the onclick to return an undefined error
    //this fixes that:
    for(let i = 0; i < itemList.length; i++)
    {
        itemList[i].getElementsByClassName("btn-danger")[0].onclick = () => {removeItem(itemList[i])};
    }
    updateCartTotal()
}

function storeValue(item)
{
    item.oldValue = item.value;
}

function updatePrice(quantityField)
{
    if(quantityField.value <= 0 || isNaN(quantityField.value))
    {
        quantityField.value = quantityField.oldValue;
        return;
    }
    
    let priceField = quantityField.parentNode.parentNode.getElementsByClassName("cart-price")[0]
    let previousTotal = Number(priceField.innerText.slice(1).split(',').join(''))

    let newTotal = (previousTotal/quantityField.oldValue)*quantityField.value
    
    priceField.innerText = format.format(newTotal);
    quantityField.oldValue = quantityField.value

    updateCartTotal();
}

function updateCartTotal()
{
    let totalPriceField = document.getElementsByClassName("cart-total-price")[0];
    let totalPrice = 0
    for(let i = 0; i<itemList.length; i++)
    {
        let itemPrice = Number(itemList[i].getElementsByClassName("cart-price")[0].innerText.slice(1).split(`,`).join(''))
        totalPrice += itemPrice;
    }

    totalPriceField.innerText = format.format(totalPrice);
}

function clearCart()
{
    for(let i = itemList.length-1; i>=0; i--)
    {
        itemList[i].remove();
    }
    updateCartTotal();
}