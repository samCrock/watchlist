import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnChanges {

  @Input() detail: any;
  @Output() addEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router) { }

  ngOnChanges() {
    console.log('Details', this.detail);
  }

  getDynamicDetailValues() {
    const dynamicDetail = {};
    for (const key in this.detail) {
      if (this.detail.hasOwnProperty(key)) {
        if (typeof this.detail[key] === 'object' && key !== 'genres') {
          dynamicDetail[key] = this.detail[key];
        }
      }
    }
    return dynamicDetail;
  }

  add() {
    localStorage.setItem('___' + this.detail.title, JSON.stringify(this.detail));
    this.addEmit.emit(this.detail);
  }

  isPresent() {
    return localStorage.getItem('___' + this.detail.title);
  }

  close() {
    // this.router.navigateByUrl('/');
    this.closeEmit.emit();

  }



}
