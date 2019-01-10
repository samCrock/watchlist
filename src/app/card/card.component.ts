import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnChanges {

  @Input() data: any;
  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnChanges() {}

  markAsViewed() {
    this.action.emit('mark');
  }

  remove() {
    this.action.emit('remove');
  }

  viewDetail() {
    this.action.emit('view');
  }

}
