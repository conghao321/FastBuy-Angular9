import { Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';



@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PageComponent implements OnInit {
  
  
  @Input() submitted
  @Input() cards;
  @Input() totalNum;
  @Input() keyWord
  
  config = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems:this.totalNum
  };

  page=1;
  public maxSize: number = 6;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
      previousLabel: '<-- ',
      nextLabel: '--> ',
      screenReaderPaginationLabel: 'Pagination',
      screenReaderPageLabel: 'page',
      screenReaderCurrentLabel: `You're on page`
  };

  constructor() {
  }
   
  ngOnInit(): void {
  }

  onPageChange(event){
    console.log(event);
    this.config.currentPage = event;
  }
}