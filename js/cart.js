(function(window){
  // TODO
    //1 Add promo code

  // Declare cart object and variables
  var cart = {
    items: [],
    total: 0,
    promos: ["BIGSALE"]
  }

  var add_to_cart_btn = document.querySelectorAll('.add-to-cart');
  var shopping_cart = document.querySelector('.shopping-cart')
  var cart_summary = document.querySelector('.cart-summary');
  var cart_total_price = document.querySelector('.amount');
  var promo_field = document.querySelector('.promo-field');
  var promo_btn = document.querySelector('.apply-promo');
  var hide_show = document.querySelector('.open-cart');
  var cart_added_items;
  var remove_item_btn;
  var cart_qty;

  // Helper to check if item-to-be-added exists in the cart items array
  function itemExists(id){
    var len = cart.items.length;
    for (i=0; i < len; i++){
      if (cart.items[i].id == id){
        return i;
        break;
      }
    }
    return -1;
  };

  // Remove item from shopping cart
  function removeItem(event){
    event.preventDefault();
    var item_index = itemExists(this.parentElement.parentElement.parentElement.classList[1]);
    var item_to_remove = this.parentElement.parentElement.parentElement;
    cart.items.splice(item_index, 1);
    item_to_remove.parentElement.removeChild(item_to_remove);
    updateTotal();
  }

  hide_show.onclick = function(){
    shopping_cart.classList.toggle('hidden');
  }

  // Listen for cart product quantity when it becomes '0'
  function updateCartQty(id){
    cart_qty.forEach(function(item, index, array){
      item.oninput = function(){
        for (i=0; i < cart.items.length; i++){
          if (cart.items[i].id == this.parentElement.parentElement.classList[1]){
            var itemIndex = i;
          }
        }
        if (this.value <= 0){
          var remove = this.parentElement.parentElement;
          remove.parentElement.removeChild(remove);
          cart.items.splice(itemIndex, 1);
          updateTotal();
        } else {
          // Update total price
          cart.items[itemIndex].qty = this.value;
          updateTotal();
          // Update item subtotal - item quantity * price
          var cart_qty_subtotal = this.parentElement.nextSibling.firstChild;
          cart.items[itemIndex].subtotal = cart.items[itemIndex].price * cart.items[itemIndex].qty;
          cart_qty_subtotal.innerHTML = "$" + cart.items[itemIndex].subtotal;
        }
      }
    });
  }

  // Assign product information and then push information
  function productInfo(event){
    event.preventDefault();
    var productId = this.getAttribute('data-product'),
        product   = document.getElementById(productId),
        productTitle = product.querySelector('.product-title').innerHTML,
        productPrice = parseInt(product.querySelector('.unit-price').innerHTML),
        productQty   = parseInt(product.querySelector('.unit-qty').value),
        productImg   = product.querySelector('.product-img').childNodes[1].src;
    pushItems(productId, productTitle, productPrice, productQty, productImg);
  };

  // Push item to cart object items array
  function pushItems(id, title, price, qty, img){
    if (cart.items.length <= 0){
      cart.items.push({id: id, title: title, price: price, qty: qty, subtotal: price * qty});
    } else if (itemExists(id) >= 0){
      alert("this item has already been added");
      return false;
    } else {
      cart.items.push({id: id, title: title, price: price, qty: qty, subtotal: price * qty});
    }
    addMarkup(id, title, price, qty, img);
    cart_qty = document.querySelectorAll('.cart-unit-qty');
    updateCartQty(id);

    if(shopping_cart.classList.contains('hidden')){
      shopping_cart.classList.toggle('hidden');
    }
    cart_summary.scrollIntoView();

    // Attach onclick event handler for 'remove' buttons
    remove_item_btn = document.querySelectorAll('.remove-product');
    remove_item_btn.forEach(function(item, index, array){
      item.onclick = removeItem;
    });
  };


  // Add HTML markup to shopping cart
  function addMarkup(id, title, price, qty, img){
    var cart_item = "<div class='cart-item "+id+"'><div class='cart-product'><div class='cart-product-summary'><div class='cart-product-img'><img src='"+img+"' alt='Legion' class='img-responsive'></div><div class='cart-product-info'>"+title+"</div><span class='cart-product-price'>$"+price+"</span><a href='#' class='remove-product'>Remove</a></div></div><div class='cart-qty'><input type='number' min='0' value="+qty+" class='unit-qty cart-unit-qty'></div><div class='cart-total'><div class='unit-qty-total'>$"+price * qty+"</div></div></div>";
    cart_summary.insertAdjacentHTML("afterbegin", cart_item);
    updateTotal();
  };

  // Update total price from cart object
  function updateTotal(){
    var result = [],
        len = cart.items.length;
    if (len == 0){
      cart_total_price.innerHTML = 0;
      return false;
    }
    for (i=0; i < len; i++){
      result.push(cart.items[i].price * cart.items[i].qty);
    }
    result = result.reduce(function(a, b){
      return a + b;
    });
    cart.total = result;
    cart_total_price.innerHTML = cart.total;
  }

  // Attach event handler to all add-to-cart buttons
  add_to_cart_btn.forEach(function(item, index, array){
    item.onclick = productInfo;
  });

  // promo_btn.onclick = function(){
  //   for (i=0; i < cart.promos.length; i++){
  //     if (promo_field.value == cart.promos[i]){
  //       cart_total_price.innerHTML = cart.total * .95;
  //     }
  //   }
  // }

})(window);