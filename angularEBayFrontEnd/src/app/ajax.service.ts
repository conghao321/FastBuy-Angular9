import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//the major service to help us request http from our backend server
@Injectable({
  providedIn: 'root'
})
export class AjaxService {
  paramsUrl="";
  url;
  keyWord;
  price1;
  price2
  newItem;
  used;
  good;
  veryGood;
  acceptable;
  canReturn;
  free;
  expedited;
  sortBy;


  constructor(private http: HttpClient) { 

  }
  //we need to set the url and its parameters
  setParams(keyWord,price1,price2,newItem,used,veryGood,
    good,acceptable,free,canReturn,expedited,sortBy){
    this.keyWord=keyWord;
    this.price1=price1;
    this.price2=price2;
    this.newItem=newItem;
    this.used=used;
    this.veryGood=veryGood;
    this.good=good;
    this.acceptable=acceptable;
    this.canReturn=canReturn;
    this.free=free;
    this.expedited=expedited;
    this.sortBy=sortBy;  
    this.setUrl();
  }
  setUrl(){
    this.paramsUrl="";
    this.paramsUrl="keyWord="+this.keyWord+"&price1="+this.price1+"&price2="+this.price2
    +"&newItem="+this.newItem+"&used="+this.used+"&veryGood="+this.veryGood+"&good="
    +this.good+"&acceptable="+this.acceptable+"&canReturn="+this.canReturn+"&free="
    +this.free+"&expedited="+this.expedited+"&sortBy="+this.sortBy;
    this.url="https://ch-ebaysearch-backend.wn.r.appspot.com/input?"+this.paramsUrl;
  }

  //return the observable object from our backend server
  getObservable(){
    console.log(this.url);
    return this.http.get(this.url);
  }
}
