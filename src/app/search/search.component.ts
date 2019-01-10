import { Component, Output, EventEmitter, AfterContentInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, filter, startWith, switchMap } from 'rxjs/operators';
import { ScraperService } from '../services/scraper.service';

@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss'],
})

export class SearchComponent implements AfterContentInit {
  searchCtrl = new FormControl();
  filteredResults: Observable<any[]>;
  @Output() selectEmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() loading: boolean;
  // private selected;

  constructor(private scraperService: ScraperService) {
    this.filteredResults = this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
        filter(_searchString => _searchString && _searchString.length > 1),
        switchMap( value => this.scraperService.searchIMDB(value))
      );
  }

  ngAfterContentInit() {
    setTimeout(() => {
      document.getElementById('search_input').focus();
  }, 500);
  }

  onSelection(result) {
    result['imdbId'] = result['id'];
    this.selectEmit.emit(result);
  }


}
