import { Component, OnInit } from '@angular/core';
import { ScraperService } from './services/scraper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private selected: any;
  private storage = [];
  private loading: boolean;

  constructor(private scraperService: ScraperService) { }

  ngOnInit() {
    this.retrieveStorage();
  }

  onSelected(selection) {
    this.loading = true;
    console.log('Selected:', selection);
    this.scraperService.getDetails(selection.imdbId).subscribe(result => {
      this.selected = result;
      this.loading = false;
    });
  }

  onAdd(event) {
    console.log('Added', event['title']);
    delete this.selected;
    this.retrieveStorage();
  }

  onDetailClose() {
    delete this.selected;
    this.retrieveStorage();
  }


  retrieveStorage() {
    const values = [],
      keys = Object.keys(localStorage);
    let i = keys.length,
      item;
    while (i--) {
      if (keys[i].substr(0, 3) === '___') {
        item = JSON.parse(localStorage.getItem(keys[i]));
        if (!item.viewed) {
          values.push(item);
        }
      }
    }
    this.storage = values;
  }

  onAction(event, data) {
    console.log(event, data);
    if (event === 'mark') {
      data.viewed = true;
      localStorage.setItem('___' + data.title, JSON.stringify(data));
    }
    if (event === 'remove') {
      localStorage.removeItem('___' + data.title);
    }
    if (event === 'view') {
      this.onSelected(data);
    }
    this.retrieveStorage();
  }

}
