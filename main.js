"use strict";



import data from './data.json' assert { type: 'json' };




// Avoid scoping issues by encapsulating 
// code inside anonymous function 
(function() { 
    // variable to store our current state 
    var cbstate; 
     
    // bind to the onload event 
    window.addEventListener('load', function() { 
      // Get the current state from localstorage 
      // State is stored as a JSON string 
      cbstate = JSON.parse(localStorage['CBState'] || '{}'); 
     
      // Loop through state array and restore checked  
      // state for matching elements 
      for(var i in cbstate) { 
        var el = document.querySelector('input[name="' + i + '"]'); 
        if (el) el.checked = true; 
      } 
     
      // Get all checkboxes that you want to monitor state for 
      var cb = document.getElementsByClassName('save-cb-state'); 
     
      // Loop through results and ... 
      for(var i = 0; i < cb.length; i++) { 
     
        //bind click event handler 
        cb[i].addEventListener('click', function(evt) { 
          // If checkboxe is checked then save to state 
          if (this.checked) { 
            cbstate[this.name] = true; 
          } 
       
         // Else remove from state 
          else if (cbstate[this.name]) { 
            delete cbstate[this.name]; 
          } 
       
         // Persist state 
          localStorage.CBState = JSON.stringify(cbstate); 
        }); 
      } 
    }); 
  })(); 





//Carousel Logic 
function setUpCarousel(carousel){

    const buttonNext = carousel.querySelector('[data-carousel-button-next]'); //Fetch right button
    const buttonPrev = carousel.querySelector('[data-carousel-button-prev]'); //Fetch Left button
    const slidesContainer = carousel.querySelector('[data-carousel-slides-container]'); //fetch slides container 
    
    buttonNext.addEventListener('click',handleNext);
    buttonPrev.addEventListener('click',handlePrev);
    
    let currentSlide = 0;
    const numSlides = slidesContainer.children.length;
    
    function handleNext(){
        currentSlide = (currentSlide+1)%numSlides;
        carousel.style.setProperty('--currentslide',currentSlide);
    }
    
    function handlePrev(){
        currentSlide= (numSlides+ (currentSlide-1))%numSlides;
        carousel.style.setProperty('--currentslide',currentSlide);
    }

    setInterval(handleNext,6000)
}

const carousels = document.querySelectorAll('[data-carousel]'); //Fetch slides container
carousels.forEach(setUpCarousel);


//End Of Carousel Logic

//Scroll Section Logic
function setUpSlider(scrollable){
    const btnNext = scrollable.querySelector('[data-scroll-button-next]');
    const btnPrev = scrollable.querySelector('[data-scroll-button-prev]');
    var currScroll =0;
    btnNext.addEventListener('click',scrollRight);
    btnPrev.addEventListener('click',scrollLeft);
    function scrollRight(){
        currScroll+=500;
        scrollable.scroll(currScroll,0);
    }
    function scrollLeft(){
        currScroll -=500;
        scrollable.scroll(currScroll,0);
    }
}


const scrollableContainer = document.querySelectorAll('[data-scrollable]');
scrollableContainer.forEach(setUpSlider);


//End Of Scroll Section Logic 



//Populating Logic

var PorkRecipes = [];
for(var i =0; i<data.Pork.length; i++){
    PorkRecipes.push(data.Pork[i]);
}

var ChickenRecipes = [];
for(var i =0; i<data.Chicken.length; i++){
    ChickenRecipes.push(data.Chicken[i]);

}

var BeefRecipes = [];
for(var i =0; i<data.Beef.length; i++){
    BeefRecipes.push(data.Beef[i]);
}

var VeggieRecipes = [];
for(var i =0; i<data.Veggie.length; i++){
    VeggieRecipes.push(data.Veggie[i]);
}
    
    
//Create a container element for the list
let porkContainer = document.getElementById("porkRecipeCards");

//Create a container element for the list
let chickenContainer = document.getElementById("chickenRecipeCards");


//Create a container element for the list
let beefContainer = document.getElementById("beefRecipeCards");

//Create a container element for the list
let veggieContainer = document.getElementById("veggieRecipeCards");
  
 function populate(category,recipes){
    //Loop through all recipes and generate cards
    if(category != null)
    for (var i = 0; i < recipes.length; i++){
        const content =`
        <button class="card-button" id=${recipes[i].name.replace(/\s+/g, '')}>
        <div class="card">
            <div class='card-header'>
                <h1>${recipes[i].name}</h1>
            </div>
            <div class='card-image' id="card-image">
                <img src="${recipes[i].image}" />
            </div>
            
            
        </div>
        </button>
        `
       
        
    category.innerHTML += content;
    }
 }   


document.getElementById('navBrand').addEventListener('mouseover',(event)=>{
    document.getElementById('navBrand').innerHTML = "HOME PAGE";
});

document.getElementById('navBrand').addEventListener('mouseleave',(event)=>{
    document.getElementById('navBrand').innerHTML = "BRAND";
});


populate(porkContainer,PorkRecipes);
populate(beefContainer,BeefRecipes);
populate(veggieContainer,VeggieRecipes);
populate(chickenContainer,ChickenRecipes);

let card = document.querySelectorAll('[class=card-button]');
let menuLink = document.querySelectorAll('[data-menu-link]');
menuLink.forEach(openCard);

card.forEach(openCard);

function openCard(target){
    target.onclick = function(){
        let clickedRecipe = findRecipe(target.id);
        console.log(clickedRecipe);
        document.cookie = 'recipe=' + JSON.stringify(clickedRecipe);
        setTimeout(function(){
            location.href ="Recipe.html";
        },0)
    }
}



if(window.location.pathname === "/Recipe.html")
populateRecipePage();

//Searches through recipes and returns class object of recipe matching id
function findRecipe(id){
    var result = PorkRecipes.find(({name}) => name.replace(/\s+/g, '') === id);
    if(result !== undefined)
        return result;
    
    result = ChickenRecipes.find(({name}) => name.replace(/\s+/g, '') === id);
    if(result !== undefined)
        return result;

    result = BeefRecipes.find(({name}) => name.replace(/\s+/g, '') === id);
    if(result !== undefined)
        return result;

    result = VeggieRecipes.find(({name}) => name.replace(/\s+/g, '') === id);
    if(result !== undefined)
        return result;
        
}


function populateRecipePage(){
    let selectedRecipe ="";
    try{
        selectedRecipe = JSON.parse(getCookie("recipe"));
    }catch(e){
        console.log(e);
    }
    
    
    
    if(selectedRecipe !== ""){
        
    
    //Give the recipe an id so it can be found again later
    let target = document.getElementById("Recipe");
    target.id = selectedRecipe.name.replace(/\s+/g, '');


    //Recipe name
    target = document.getElementById("RecipeName");
    var content =`<h1 class="recipe-left-name_container">${selectedRecipe.name}</h1>`
    target.innerHTML += content;
    
    //Recipe Image
    target = document.getElementById("RecipeImage");
    content = `<img src=${selectedRecipe.image} >`
    target.innerHTML += content;

    //Recipe Description 
    target = document.getElementById("RecipeDescription");
    content = `<p>${selectedRecipe.description}</p>`
    target.innerHTML += content;

     //Recipe Servings 
     target = document.getElementById("RecipeServings");
     content = `<p>${selectedRecipe.servings}</p>`
     target.innerHTML += content;

     //Recipe Ingredients  
     content = ``
     target = document.getElementById("RecipeIngredients");
     for(var i=0; i<selectedRecipe.ingredients.length; i++){
        content += `<li>${selectedRecipe.ingredients[i]}</li>`
     }
     
     target.innerHTML += content;

     //Recipe Directions  
     content = ``
     target = document.getElementById("RecipeDirections");
     for(var i=0; i<selectedRecipe.steps.length; i++){
        content += `<li>${selectedRecipe.steps[i]}</li> `
     }
     
     target.innerHTML += content;
    }

}

if(window.location.pathname === "/Recipe.html"){
    let toggleIngredients = document.getElementById('IngredientsBtn');
    let toggleDirections = document.getElementById('DirectionsBtn');
    let ingredientsSection = document.getElementById('RecipeIngredients');
    let directionsSections = document.getElementById('RecipeDirections');
        toggleDirections.onclick = function(){
            ingredientsSection.classList.add('recipe-right-active');
            directionsSections.classList.remove('recipe-right-active');

        }
        toggleIngredients.onclick = function(){
            directionsSections.classList.add('recipe-right-active');
            ingredientsSection.classList.remove('recipe-right-active');

    }
}



function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

 //End Populating Logic

 //Cart Logic
 var Cart = []; //This is where all the added items are stored
 
 renderCart();

 if(window.location.pathname === "/Recipe.html"){
let cartBtn = document.getElementById('AddToCart');
 cartBtn.onclick = function (){

    let recipeId = document.getElementsByClassName('recipe');
    let selectedRecipe = findRecipe(recipeId[0].id);
    
    for(var i =0; i<selectedRecipe.ingredients.length; i++){
        const ingredient = {name:selectedRecipe.ingredients[i],price:selectedRecipe.price/selectedRecipe.ingredients.length,Quantity:1};

        let check = Cart.findIndex(element => element.name === ingredient.name)
        if(check !== -1){
            Cart[check].Quantity++;
            Cart[check].price += ingredient.price;
        }else{
            Cart.push(ingredient);
        }

        
    }

    document.cookie = 'cart=' + JSON.stringify(Cart);
    
    renderCart();

    document.getElementById("cartCheckBox").checked = true;
    
 }
 }
function renderCart(){
    try{
        Cart = JSON.parse(getCookie("cart"));
    }catch(e){
        console.log(e);
    }
    
    let cartList = document.getElementById('cart');
    cartList.innerHTML = `<h1 style="text-decoration: underline;">Your Cart </h1> `
    
    if(Cart.length === 0){
        const content = `
        <h3> Your Cart Is Empty </h3>
        `
        cartList.innerHTML += content;
    }else{
        for(var i =0; i<Cart.length; i++){
            const content = `
            <li class="cart-item" data-cart-item>${Cart[i].name}
            <h3>$${Cart[i].price.toFixed(2)}</h3>
            <h3>Quantity: ${Cart[i].Quantity} </h3>
            <button class="cart-item-remove" id=${i} data-remove-btn> Remove </button>
            </li>
            `
            cartList.innerHTML += content;
        }
    }
    renderCartTotal();
    
    const cartItems = document.querySelectorAll('[data-cart-item]');
    cartItems.forEach(remove);
    document.getElementById('checkout-btn').onclick = function(){
        location.href = "checkout.html";
    }

 }


    

function remove(item){
    const removeItem = item.querySelector('[data-remove-btn]');
   removeItem.onclick = function destroy(){
    let id = removeItem.getAttribute("id");
    console.log(id);
    Cart.splice(id,1);
    document.cookie = 'cart=' + JSON.stringify(Cart);
    renderCart();
    
   }
}



function renderCartTotal(){
    var totalPrice =0;
    for(var i=0; i<Cart.length;i++){
        totalPrice += Cart[i].price;
    }

    let result = document.getElementById('cart');
    console.log(result);
    const content = `<div class="summary">
    <h2 class="subtotal">Subtotal: $${totalPrice.toFixed(2)} </h2> <h2 class="tax">Tax: $${(totalPrice*0.12).toFixed(2)}</h2> <h2 class="total">Total: $${(totalPrice + (totalPrice*0.12)).toFixed(2)} </h2>
    </div>
    <button class="checkout" id="checkout-btn">Checkout</button>`
    result.innerHTML += content;
}


 
 //End Cart Logic 

 //CheckoutPage
 
 if(window.location.pathname === "/checkout.html"){
    let items = document.getElementById('order-summary-items');
    let quantities = document.getElementById('order-summary-quantity');
    let prices = document.getElementById('order-summary-Price');
    let sbtotal =0;
    let tx = 0;
    let ttl = 0;

    for(var i =0; i<Cart.length; i++){
        items.innerHTML+= `<h4>${Cart[i].name}</h4>`;
        quantities.innerHTML += `<h4>${Cart[i].Quantity}</h4>`;
        prices.innerHTML += `<h4>${Cart[i].price.toFixed(2)} `;
        sbtotal += Cart[i].price;
    }
    tx = sbtotal*0.12;
    ttl = sbtotal + tx;
    document.getElementById('checkout-summary-subtotal').innerHTML += ` $${sbtotal.toFixed(2)}`;
    document.getElementById('checkout-summary-tax').innerHTML += ` $${(tx).toFixed(2)}`;
    document.getElementById('checkout-summary-total').innerHTML += ` $${(ttl).toFixed(2)}`;

    let confirmpurchasebtn = document.getElementById('ConfirmPurchase');
    confirmpurchasebtn.onclick = function(){
        confirmpurchasebtn.innerHTML = `Thank You`
        setTimeout(resetPurchaseBtn,3000);
    }

    function resetPurchaseBtn(){
        confirmpurchasebtn.innerHTML = `Confirm Purchase`;
    }
    
    renderCart();

 }
 
 //End CheckoutPage

   
    

    


