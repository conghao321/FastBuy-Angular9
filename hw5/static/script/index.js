/*
The main function to submit the form and and listen the browser's action.
That's combination of the events with our functions .
*/
function submitForm(event){
    //prevent default actions
    event.preventDefault();
    validation=checkInput();
    if(!validation) return;
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

    validation=true;
    if(keyWord==""){
        window.alert("key word is required");
        validation=false;
    }
    if (minPrice< 0 || maxPrice<0) {
        message = "js Price Range values cannot be negative";
        window.alert(message);
        validation=false;
    }
    if(minPrice>maxPrice){
        message = "js min no greater than max";
        window.alert(message);
        validation=false;
    }  
    return validation;
}

/*
The core part of our project, to get the elements and send a request
The request is based on AJAX

*/
function sendRequest(){
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
            display(response);
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

function display(response){
    objects=JSON.parse(response);
    //console.log(objects);
    var totalResult=Number(objects[0]);
    document.getElementById("resultText").innerHTML ="total result :"+totalResult+" found";
    
    var topCards=document.getElementById("topThreeCards");
    topCards.innerHTML="";

    if(totalResult==0){
        topCards.innerHTML="<h1>meidongxi, shabi</h1>";
        return;
    }
    //top3 cards
    for(var i=1;i<=3;i++){
        appendCard(topCards,objects[i]);
    }

    //last 7cards
    var otherCards=document.getElementById("otherCards");
    for(var i=4;i<objects.length;i++){
        appendCard(otherCards,objects[i]);
    }  
    
    document.getElementById("show-more").style.display='block';
}

function appendCard(target,card){

    var imgUrl=card.imageURL;

    if(imgUrl=="https://thumbs1.ebaystatic.com/pict/04040_0.jpg"){
        imgUrl="./static/images/ebay_default.jpg";
    }

    var cardText="<div class='card-container'><h4 class='card-title'>"+card.title;
    cardText+="<img class='card-image' src='"+imgUrl+"' alt='no tu'>";
    cardText+="</h4><h4 class='card-category'>Category:"+card.category;
    cardText+="</h4><h4 class='card-price'>Price:$"+card.price+"</h4></div>";
    target.innerHTML +=cardText;
}


 


//
function showMoreCards(event){
    event.preventDefault();
    var target=document.getElementById("otherCardsContainer");
    var display=target.style.display;
    if(display=='block'){
        target.style.display='none';//start hiding the 7cards
        document.getElementById("show-more").style.display='block';
        document.getElementById("show-less").style.display='none';
    }else{
        target.style.display='block'//start displaying the 7cards
        document.getElementById("show-more").style.display='none';
        document.getElementById("show-less").style.display='block';
    }
}

showMore.addEventListener("click",showMoreCards);
showLess.addEventListener("click",showMoreCards);