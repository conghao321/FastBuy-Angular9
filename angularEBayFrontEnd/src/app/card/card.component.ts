import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() item;
  showDetails=false;
  buttonContent='Show Details';

  constructor() { 
  }

  ngOnInit(): void {
  }

  display(){
    this.showDetails=!this.showDetails;
    if(this.buttonContent=='Show Details'){
      this.buttonContent='Hide Details'
    }else{
      this.buttonContent='Show Details'
    }
  }

}
