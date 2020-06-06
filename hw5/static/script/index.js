var expand=false;
var clicked=new Array();
for(var i=0;i<10;i++ ){
    clicked[i]=false;
}

/*
The main function to submit the form and and listen the browser's action.
That's combination of the events with our functions .
*/
function submitForm(event){
    //prevent default actions
    event.preventDefault();
    validation=checkInput();
    if(!validation) return;
    reset();
    sendRequest();
}
formOne.addEventListener('submit', submitForm);

/*
This is function is used to check our form's validation
The requirement definitely follows the homework's documentation
*/
function checkInput() { 
    var keyWord;
    var minPrice,maxPrice;
    var message;
        
    keyWord=document.getElementById("key-words").value;
    minPrice = document.getElementById("price1").value;
    maxPrice = document.getElementById("price2").value;
    
    minPrice=Number(minPrice);
    maxPrice=Number(maxPrice);
    if(maxPrice==0) maxPrice=Number.MAX_SAFE_INTEGER ;

    validation=true;
    if(keyWord==""){
        window.alert("Key word is required! Please try again");
        validation=false;
    }
    if (minPrice< 0 || maxPrice<0) {
        message = "Price range values cannot be negative. Please try a value greater than or equal to 0.0";
        window.alert(message);
        validation=false;
    }
    if(minPrice>maxPrice){
        message = "Oops! Lower price limit cannot be greater than the upper price limit! Please try again";
        window.alert(message);
        validation=false;
    }  
    return validation;
}

/*
The core part of our project, to get the elements and send a request
The request is based on AJAX
*/
function sendRequest(show){
    var keyWords=document.getElementById("key-words").value;
    var priceMin=document.getElementById("price1").value;
    var priceMax=document.getElementById("price2").value;
    var newItem=document.getElementById("new").checked;
    var usedItem=document.getElementById("used").checked;
    var veryGoodItem=document.getElementById("very-good").checked;
    var goodItem=document.getElementById("good").checked;
    var acceptableItem=document.getElementById("acceptable").checked;
    var returnAccepted=document.getElementById("return").checked;
    var freeShipping=document.getElementById("free").checked;
    var expShipping=document.getElementById("expedited").checked;
    var sortBy=document.getElementById("sort-selector").value;
    
    //request data from middle-server side
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response=xhttp.responseText;
            display(response,keyWords);
      }
    };

    //to concat  the router URL with parameters and open it
    xhttp.open("GET", "/input?key-words="+keyWords+"&price1="+priceMin+
    "&price2="+priceMax+"&newItem="+newItem+"&usedItem="+usedItem+"&veryGoodItem="+
    veryGoodItem+"&goodItem="+goodItem+"&acceptableItem="+acceptableItem+
    "&returnAccepted="+returnAccepted+"&freeShipping="+freeShipping+"&expShipping="+expShipping+"&sortBy="+sortBy  
    , true);
    xhttp.send();    
}
//show the result cards
function display(response,keyWords){
    objects=JSON.parse(response);
    //console.log(objects);
    var totalResult=Number(objects[0]);
    var resStat=document.getElementById("resultStat");
    if(totalResult==0){
        resStat.innerHTML="<h2 class='no-result-text'>No result found</h2>";
        return;
    }
    
    resStat.innerHTML ="<h3 class='result-stat'>"+totalResult+" results found for <span class='search-title'>"+keyWords+"</span> </h3>"+"<hr class='split-line'>";
    resStat.innerHtml="<hr class='split-line'>";

    var topCards=document.getElementById("topThreeCards");
    topCards.innerHTML="";
    //top3 cards
    for(var i=1;i<=3;i++){
        topCards.innerHTML+=newCard(objects[i],i);
    }

    //last 7cards
    var otherCards=document.getElementById("otherCards");
    for(var i=4;i<objects.length;i++){
        otherCards.innerHTML+=newCard(objects[i],i);
    }  

    //to tackle the two buttons when click submit
    if(expand==false){
        document.getElementById("show-more").style.display='block';
    }else if(expand==true){
        document.getElementById("show-more").style.display='none';
    }
    
    //adding listener to the cards to reflect the clicking
    addExpandListener();
}

function addExpandListener(){
    for (var i = 0; i < document.querySelectorAll(".card-container").length; i++) {
        document.querySelectorAll(".card-container")[i].addEventListener("click", function() {
            //to detect which cards id. for example card1's id is 1;
            if(document.getElementsByClassName("card-title")[i-1].event=="click"){
                console.log(document.getElementsByClassName("card-title")[i-1]);
                alert("sss");
                return;
            }
            var index=Number(this.id[4]);
            expandCard(this,objects[index],index);  
        });
    }

    for (var i = 0; i < document.querySelectorAll(".card-title").length; i++) {
        document.querySelectorAll(".card-title")[i].removeEventListener("click", function() {
            //to detect which cards id. for example card1's id is 1;
            alert("removed");
        });
    }
}
//to append new card-item below the previous cards
function newCard(card,index){
    var imgUrl=card.imageURL;
    var shippingCost=Number(card.shippingCost).toFixed(2);

    if(imgUrl=="https://thumbs1.ebaystatic.com/pict/04040_0.jpg"){
        imgUrl="./static/images/ebay_default.jpg";
    }

    var cardText="<div class='card-container' id='card"+index+"'>";
    
    cardText+="<div class='card-img-container'><img class='card-image' src='"+imgUrl+"' alt='no tu'></div>";

    cardText+="<div class='card-text-container'>";
    cardText+="<h4 class='card-title'><a href='"+card.productLink+"' target='_blank'>"+card.title+"</a></h4>";
    cardText+="<h4 class='card-category'>Category:&nbsp;"+card.category+"&nbsp<span><a href='"+card.productLink+"' target='_blank'><img class='redirect-img' src='./static/images/redirect.png'></a></span></h4>";
    
    cardText+="<h4 class='card-category'>Conditions:&nbsp;"+card.condition;
    if(card.topRated!='false'){
        cardText+="<span><img src='./static/images/topRatedImage.png' class='top-rated-img' alt='top rated'></span>";
    } 
    cardText+="</h4>";
    if(shippingCost<=0){
        cardText+="<h4 class='card-price'>Price:&nbsp;$"+card.price+"</h4></div>";
    }else{
        cardText+="<h4 class='card-price'>Price:&nbsp;$"+card.price+"<span class='card-shipping-cost'>&nbsp+&nbsp(&nbsp$"+shippingCost
        +"&nbsp) for shipping</span></h4></div>";
    }
    return cardText;
}

function completeCard(card,index){
    var imgUrl=card.imageURL;
    var shippingCost=Number(card.shippingCost).toFixed(2);

    if(imgUrl=="https://thumbs1.ebaystatic.com/pict/04040_0.jpg"){
        imgUrl="./static/images/ebay_default.jpg";
    }

    var cardText=""; 
    cardText+="<div class='card-img-container'><img class='card-image' src='"+imgUrl+"' alt='no tu'></div>";
    cardText+="<div class='card-text-container'>";
    cardText+="<h4><img class='red-cross' id='redCross"+index+"' src='./static/images/cross.png'></h4>";
    cardText+="<h4 class='card-title'><a href='"+card.productLink+"' target='_blank'>"+card.title+"</a></h4>";
    cardText+="<h4 class='card-category'>Category:&nbsp;"+card.category+"&nbsp<span><a href='"+card.productLink+"' target='_blank'><img class='redirect-img' src='./static/images/redirect.png'></a></span></h4>";;
    cardText+="<h4 class='card-category'>Conditions:&nbsp;"+card.condition;
    if(card.topRated!='false'){
        cardText+="<span><img src='./static/images/topRatedImage.png' class='top-rated-img' alt='top rated'></span>";
    } 
    cardText+="</h4>";

    if(card.acceptReturn=='true'){
        cardText+="<h4 class='card-return'>Sellers&nbsp<span class='accept-bold' style='font-size:bold;'>accepts</span> returns</h4>";
    }else{
        cardText+="<h4 class='card-return'>Sellers&nbsp<span class='accept-bold' style='font-size:bold;'>does not accepts</span> returns</h4>";
    }
    if(shippingCost==0){
        cardText+="<h4 class='shipping'>Free Shipping Available&nbsp<span>";
    }else{
        cardText+="<h4 class='shipping'>No Free Shipping&nbsp<span>";
    }
    if(card.expedited=='true'){
        cardText+="--&nbspExpedited Shipping available";
    }
    cardText+="</span></h4>";

    if(shippingCost<=0){
        cardText+="<h4 class='card-price'>Price:&nbsp;$"+card.price+"</h4></div>";
    }else{
        cardText+="<h4 class='card-price'>Price:&nbsp;$"+card.price+"<span class='card-shipping-cost'>&nbsp+&nbsp(&nbsp$"+shippingCost
        +"&nbsp) for shipping</span><span class='card-location'>&nbspFrom&nbsp"+card.location+"</span></h4></div>";
    }
    return cardText;
}

function prevCard(card){
    var imgUrl=card.imageURL;
    var shippingCost=Number(card.shippingCost).toFixed(2);

    var cardText="";
    if(imgUrl=="https://thumbs1.ebaystatic.com/pict/04040_0.jpg"){
        imgUrl="./static/images/ebay_default.jpg";
    }
   
    cardText+="<div class='card-img-container'><img class='card-image' src='"+imgUrl+"' alt='no tu'></div>";

    cardText+="<div class='card-text-container'>";
    cardText+="<h4 class='card-title'><a href='"+card.productLink+"' target='_blank'>"+card.title+"</a></h4>";
    cardText+="<h4 class='card-category'>Category:&nbsp;"+card.category+"&nbsp<span><a href='"+card.productLink+"' target='_blank'><img class='redirect-img' src='./static/images/redirect.png'></a></span></h4>";
    
    cardText+="<h4 class='card-category'>Conditions:&nbsp;"+card.condition;
    if(card.topRated!='false'){
        cardText+="<span><img src='./static/images/topRatedImage.png' class='top-rated-img' alt='top rated'></span>";
    } 
    cardText+="</h4>";
    if(shippingCost<=0){
        cardText+="<h4 class='card-price'>Price:&nbsp;$"+card.price+"</h4></div>";
    }else{
        cardText+="<h4 class='card-price'>Price:&nbsp;$"+card.price+"<span class='card-shipping-cost'>&nbsp+&nbsp(&nbsp$"+shippingCost
        +"&nbsp) for shipping</span></h4></div>";
    }
    return cardText;
}

//to display other 7-tem
function showMoreCards(event){
    event.preventDefault();
    var target=document.getElementById("otherCardsContainer");
    var othersDisplay=target.style.display;
    more=document.getElementById("show-more");
    less=document.getElementById("show-less");
    if(othersDisplay=='block'){
        target.style.display='none';//start hiding the 7cards
        more.style.display='block';
        less.style.display='none';
        expand=false;
        skipTo(false);
    }else{
        target.style.display='block'//start displaying the 7cards
        more.style.display='none';
        less.style.display='block';
        expand=true;
        skipTo(true);
    }
}

showMore.addEventListener("click",showMoreCards);
showLess.addEventListener("click",showMoreCards);

function reset(){
    document.getElementById("show-more").style.display='none';
    document.getElementById("show-less").style.display='none';
    document.getElementById("otherCards").innerHTML="";
    document.getElementById("topThreeCards").innerHTML="";
}

function skipTo(downWard){

    if(downWard){
        window.scrollBy({
            top: 2000,
            behavior: 'smooth'
          });    
    }else{
        window.scrollBy({
            top: -2000,
            behavior: 'smooth'
          });    
    }
    }


//click card
function expandCard(card,object,index){
    //console.log(document.querySelectorAll(".red-cross"));
    if(clicked[index]==false){
        card.innerHTML=completeCard(object,index);
        card.style.height='300px';
        document.getElementById("redCross"+index).addEventListener("click",function(){
            card.style.height='220px';
            card.innerHTML=prevCard(object);
        });
    }
    clicked[index]=!clicked[index];
    return;
}
