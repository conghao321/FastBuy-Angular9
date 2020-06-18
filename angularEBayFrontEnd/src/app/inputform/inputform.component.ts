import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AjaxService } from '../ajax.service';



@Component({
  selector: 'app-inputform',
  templateUrl: './inputform.component.html',
  styleUrls: ['./inputform.component.css']
})


//export this class
export class FormComponent implements OnInit {
  inputForm;
  submitted = false;
  inputError= false;
  keyWordRequired=false;
  data=[];
  pageIndex=0;
  totalNum;
  keyWord;

 
  
  //constructor, introduce a FormBuilder help us to control forms
  //and for a group inputs,we set a default value;
  constructor(
    private formBuilder: FormBuilder,
    private ajaxService:AjaxService  
    ) { 
    this.inputForm = this.formBuilder.group({
        keyWord:'',
        price1: '',
        price2:'',
        new:'',
        used:'',
        veryGood:'',
        good:'',
        acceptable:'',
        return:'',
        free:'',
        expedited:'',
        sortBy:'BestMatch'
      });   
  }

  ngOnInit() {

  }
  
  //binding this function with submit button
  onSubmit(data) {
    if(this.checkInput(data)){
      this.keyWord=data.keyWord;
      var ajax=this.ajaxService;

      console.log('laiyige');
      ajax.setParams(data.keyWord,data.price1,data.price2,data.new,
        data.used,data.veryGood,data.good,data.acceptable,data.return,
        data.free,data.expedited,data.sortBy);
  
      /*the main functions about displaying our data
      the return value is a observable object
      we need to use its subscribe method to help us
      start to observe that observable object.
    
      */
      ajax.getObservable().subscribe((data)=>{  
        var len=Object.keys(data).length;
        for(var i=0;i<len;i++) {
          this.data[i]=Object.freeze(data[i]);
        }       
        this.totalNum=len;
        this.inputError=false;
      });
    }else{
      this.inputError=true;
    }
    this.submitted=true; 
    //inject this service, the main logic about http and ajax
    console.log(this.data);
  }



  checkInput(data){

    if(data.keyWord===null||data.keyWord===''||data.keyWord==='null'){
      return false;
    }
    if(Number(data.price1)>Number(data.price2)||Number(data.price1)<0||Number(data.price2)<0){
      return false;
    }
    return true;
  }
  //binding this function with reset button
  resetForm(){
    this.submitted=false;
    this.inputForm.reset({
      keyWord:'',
      price1: '',
      price2:'',
      new:'',
      used:'',
      veryGood:'',
      good:'',
      acceptable:'',
      return:'',
      free:'',
      expedited:'',
      sortBy:'BestMatch'
    });
    this.inputError=false;
  }
}