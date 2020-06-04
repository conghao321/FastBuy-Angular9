/*
The main function to submit the form and and listen the browser's action.
That's combination of the events with our functions .
*/
var expand=false;
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
        appendCard(topCards,objects[i],i);
    }

    //last 7cards
    var otherCards=document.getElementById("otherCards");
    for(var i=4;i<objects.length;i++){
        appendCard(otherCards,objects[i],i);
    }  
    //to tackle the two buttons when click submit
    if(expand==false){
        document.getElementById("show-more").style.display='block';
    }else if(expand==true){
        document.getElementById("show-more").style.display='none';
    }
}




//to append new card-item
function appendCard(target,card,index){

    var imgUrl=card.imageURL;

    if(imgUrl=="https://thumbs1.ebaystatic.com/pict/04040_0.jpg"){
        imgUrl="./static/images/ebay_default.jpg";
    }

    var cardText="<div class='card-container' id='card"+index+"'>";
    
    cardText+="<div class='card-img-container'><img class='card-image' src='"+imgUrl+"' alt='no tu'></div>";

    cardText+="<div class='card-text-container'>";
    cardText+="<h4 class='card-title'>"+card.title+"</h4>";
    cardText+="</h4><h4 class='card-category'>Category:&nbsp;"+card.category+"&nbsp;</h4>";
    cardText+="<h4 class='card-category'>Category:&nbsp;"+card.condition;

    if(card.topRated!='false'){
        cardText+="<span><img src='./static/images/topRatedImage.png' class='top-rated-img' alt='top rated'></span>";
    } 
    cardText+="</h4>";


    cardText+="</h4><h4 class='card-price'>Price:&nbsp;$"+card.price+"</h4></div></div>";
    target.innerHTML +=cardText;
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
    }else{
        target.style.display='block'//start displaying the 7cards
        more.style.display='none';
        less.style.display='block';
        expand=true;
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