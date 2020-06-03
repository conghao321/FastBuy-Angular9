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
            text=xhttp.responseText;
            display(text);
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

function display(json_text){
    text=JSON.parse(json_text);
    console.log(text);
    for(var i=0;i<text.length;i++){
        console.log(text[i].title);
        document.getElementById("bottom").innerHTML =text[i].title
    }
    //document.getElementById("bottom").innerHTML =text;
}