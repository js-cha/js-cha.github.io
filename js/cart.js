(function(window){
  var cart = {
    items: [],
    total: 0,
    promos: {
      BIGSALE: 0.25,
      OVERW10: 0.10,
      ORDER5:  0.05,
    },
    discounted: false,
    promoCodeApplied: "",
    discountPercent: 0
  };

  var addToCartBtns = document.querySelectorAll('.add-to-cart');
  var cartSummary = document.querySelector('.cart-summary');
  var cartTotalPrice = document.querySelector('.amount');
  var codeApplied = document.querySelector('.code-added');
  var deducted = document.querySelector('.discount-value');
  var promoBtn = document.querySelector('.apply-promo');
  var promoField = document.querySelector('.promo-field');
  var shoppingCart = document.querySelector('.shopping-cart');
  var toggleCartBtn = document.querySelector('.open-cart');

  var cartAddedItems;
  var cartQty;
  var removeItemBtns;

  addToCartBtns.forEach(function(item, index, array){
    item.onclick = getProductInfo;
  });

  toggleCartBtn.onclick = function(){
    shoppingCart.classList.toggle('hidden');
  };

  promoBtn.onclick = function(){
    var promoCode = promoField.value;
    if (promoCode.length <= 0 || cart.promos.hasOwnProperty(promoCode) == false){
      return false;
    } else if (cart.discounted == true){
      alert("Only one promo code per transaction can be used");
    } else {
      applyPromoCode(promoCode);
    }
  };

  function applyPromoCode(code){
    var overWatchIndex = getItemIndex("pcg01");
    var deductedValue = cart.promos[code];
    if (code == "OVERW10" && overWatchIndex >= 0){
      deducted.innerHTML = "Discount: " + deductedValue * 100 + "%" + " off Overwatch order";
      cart.items[overWatchIndex].discountedPrice = (cart.items[overWatchIndex].price * (1 - deductedValue)).toFixed(2);
    } else if (code !== "OVERW10"){
      cart.discountPercent = deductedValue;
      deducted.innerHTML = "Discount: " + deductedValue * 100 + "%" + " off total order";
    } else {
      return false;
    }
    cart.discounted = true;
    cart.promoCodeApplied = code;
    updateTotal();
    codeApplied.innerHTML = "Promo code applied: " + "<strong>"+code+"</strong>";
    codeApplied.classList.remove('hidden');
    deducted.classList.remove('hidden');
  };

  function resetPromoCode(){
    promoField.value = "";
    cart.discounted = false;
    cart.discountPercent = 0;
    codeApplied.classList.add('hidden');
    deducted.classList.add('hidden');
    updateTotal();
  };

  function getItemIndex(id){
    var len = cart.items.length;
    for (i=0; i < len; i++){
      if (cart.items[i].id == id){
        return i;
        break;
      }
    }
    return -1;
  };

  function removeItem(event){
    event.preventDefault();
    var itemIndex = getItemIndex(this.parentElement.parentElement.parentElement.classList[1]);
    var itemToRemove = this.parentElement.parentElement.parentElement;
    cart.items.splice(itemIndex, 1);
    itemToRemove.parentElement.removeChild(itemToRemove);
    if (cart.items.length <= 0){
      resetPromoCode();
    } else {
      updateTotal();
    }
  };

  function updateCartQty(id){
    cartQty.forEach(function(item, index, array){
      item.oninput = function(){
        var itemIndex = getItemIndex(this.parentElement.parentElement.classList[1]);
        if (this.value <= 0){
          var remove = this.parentElement.parentElement;
          remove.parentElement.removeChild(remove);
          cart.items.splice(itemIndex, 1);
          updateTotal();
        } else {
          cart.items[itemIndex].qty = this.value;
          updateTotal();
          var cartQtySubtotal = this.parentElement.nextSibling.firstChild;
          cart.items[itemIndex].subtotal = cart.items[itemIndex].price * cart.items[itemIndex].qty;
          cartQtySubtotal.innerHTML = "$" + cart.items[itemIndex].subtotal;
        }
        if (cart.items.length <= 0){
          resetPromoCode();
        }
      };
    });
  };

  function getProductInfo(event){
    event.preventDefault();
    var productId = this.getAttribute('data-product'),
        product = document.getElementById(productId),
        productTitle = product.querySelector('.product-title').innerHTML,
        productPrice = parseInt(product.querySelector('.unit-price').innerHTML),
        productQty   = parseInt(product.querySelector('.unit-qty').value),
        productImg   = product.querySelector('.product-img').childNodes[1].src;
    pushItems(productId, productTitle, productPrice, productQty, productImg);
  };

  function pushItems(id, title, price, qty, img){
    if (cart.items.length <= 0){
      cart.items.push({id: id, title: title, price: price, qty: qty, subtotal: price * qty});
    } else if (getItemIndex(id) >= 0){
      alert("this item has already been added");
      return false;
    } else {
      cart.items.push({id: id, title: title, price: price, qty: qty, subtotal: price * qty});
    }
    addMarkup(id, title, price, qty, img);
    cartQty = document.querySelectorAll('.cart-unit-qty');
    updateCartQty(id);
    if (shoppingCart.classList.contains('hidden')){
      shoppingCart.classList.toggle('hidden');
    }
    cartSummary.scrollIntoView();
    removeItemBtns = document.querySelectorAll('.remove-product');
    removeItemBtns.forEach(function(item, index, array){
      item.onclick = removeItem;
    });
  };

  function addMarkup(id, title, price, qty, img){
    var cartItem = "<div class='cart-item "+id+"'><div class='cart-product'><div class='cart-product-summary'><div class='cart-product-img'><img src='"+img+"' alt='Legion' class='img-responsive'></div><div class='cart-product-info'>"+title+"</div><span class='cart-product-price'>$"+price+"</span><a href='#' class='remove-product'>Remove</a></div></div><div class='cart-qty'><input type='number' min='0' value="+qty+" class='unit-qty cart-unit-qty'></div><div class='cart-total'><div class='unit-qty-total'>$"+price * qty+"</div></div></div>";
    cartSummary.insertAdjacentHTML("afterbegin", cartItem);
    updateTotal();
  };

  function updateTotal(code, value){
    var result = [];
    var len = cart.items.length;
    if (len == 0){
      cartTotalPrice.innerHTML = 0;
      return false;
    }
    for (i=0; i < len; i++){
      if (cart.items[i].discountedPrice){
        result.push(cart.items[i].discountedPrice * cart.items[i].qty);
      } else {
        result.push(cart.items[i].price * cart.items[i].qty);
      }
    }
    result = result.reduce(function(a, b){
      return a + b;
    });
    if (cart.discounted == true){
      cart.total = result - (result * cart.discountPercent);
      cartTotalPrice.innerHTML = cart.total;
    } else {
      cart.total = result;
      cartTotalPrice.innerHTML = cart.total;
    }
  };
})(window);