(function(window){
  // TODO
    //1 Add remove and update quantity functionality
    //2 Add hide and show cart functionality
    //3 ...

  // Declare cart object and variables
  var cart = {
    items: [],
    total: 0
  }
  var addToCartBtn = document.querySelectorAll('.add-to-cart');
  var cartPrice = document.querySelector('.amount');
  var cart_summary = document.querySelector('.cart-summary');

  // Helper to check if item-to-be-added exists in the cart items array
  function itemExists(title){
    var len = cart.items.length;
    for (i=0; i < len; i++){
      if (cart.items[i].title == title){
        return i;
        break;
      }
    }
    return -1;
  };

  // Assign product information and then push information
  function productInfo(event){
    event.preventDefault();
    var productId = this.getAttribute('data-product'),
        product   = document.getElementById(productId),
        productTitle = product.querySelector('.product-title').innerHTML,
        productPrice = parseInt(product.querySelector('.unit-price').innerHTML),
        productQty   = parseInt(product.querySelector('.unit-qty').value),
        productImg   = product.querySelector('.product-img').childNodes[1].src;
    pushItems(productTitle, productPrice, productQty, productImg);
  };

  // Push item to cart object, items array
  function pushItems(title, price, qty, img){
    if (cart.items.length <= 0){
      cart.items.push({title: title, price: price, qty: qty});
    } else if (itemExists(title) >= 0){
      var itemIndex = itemExists(title);
      cart.items[itemIndex].qty += qty;
    } else {
      cart.items.push({title: title, price: price, qty: qty});
    }
    addMarkUp(title, price, qty, img);
    cart_summary.scrollIntoView();
  };

  // Add HTML markup to shopping cart
  function addMarkUp(title, price, qty, img){
    var cart_item = "<div class='cart-item'><div class='cart-product'><div class='cart-product-summary'><div class='cart-product-img'><img src='"+img+"' alt='Legion' class='img-responsive'></div><div class='cart-product-info'>"+title+"</div><span class='cart-product-price'>$"+price+"</span><a href='#' class='remove-product'>Remove</a></div></div><div class='cart-qty'><input type='number' min='0' value="+qty+" class='unit-qty cart-unit-qty'></div><div class='cart-total'><div class='unit-qty-total'>$"+price * qty+"</div></div></div>";
    cart_summary.insertAdjacentHTML("afterbegin", cart_item);
    updateTotal();
  }

  // Update total price from cart object
  function updateTotal(){
    var result = [],
        len = cart.items.length;
    for (i=0; i < len; i++){
      result.push(cart.items[i].price * cart.items[i].qty);
    }
    result = result.reduce(function(a, b){
      return a + b;
    });
    cart.total = result;
    cartPrice.innerHTML = cart.total;
  }

  // Attach event handler to all add-to-cart buttons
  addToCartBtn.forEach(function(item, index, array){
    item.onclick = productInfo;
  });

})(window);