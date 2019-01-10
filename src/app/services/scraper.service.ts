import { Injectable } from '@angular/core';
import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScraperService {

  private proxyurl = "https://cors-anywhere.herokuapp.com/";

  constructor(private http: HttpClient) { }

  searchIMDB(_searchString: string) {
    return Observable.create(observer => {
      const url = this.proxyurl + 'https://v2.sg.media-imdb.com/suggests/' + _searchString.substr(0, 1) + '/' +
        _searchString + '.json?callback=imdb$' + _searchString + '&_=1546960801764';
      return this.http.get<any>(url, { responseType: 'text' as 'json' })
        .subscribe(response => {
          const splitter = 'imdb$' + _searchString + '({"v":1,"q":"' + _searchString + '","d":';
          let parsed = response.split(splitter)[1];
          parsed = JSON.parse(parsed.substr(0, parsed.length - 2));
          parsed['imdbId'] = parsed['id'];
          console.log('Response =>', parsed);
          observer.next(parsed);
        });
    });
  }

  getDetails(imdbId: string) {
    return Observable.create(observer => {
      const url = this.proxyurl + 'https://www.imdb.com/title/' + imdbId;
      return this.http.get<any>(url, { responseType: 'text' as 'json' })
        .subscribe(response => {
          const $ = cheerio.load(response);
          const result = {};
          console.log('title', $('.title_wrapper h1')[0]);
          result['imdbId'] = imdbId;
          result['title'] = $('.title_wrapper h1')[0].children[0].data.trim();
          result['time'] = $('time')[0] ? $('time')[0].children[0].data.trim() : '';
          result['genres'] = [];
          $('.title_wrapper a').filter((i, t) => {
            if (t.attribs.href.match('/search/')) {
              result['genres'].push(t.children[0].data.trim());
            }
            if (t.attribs.href.match('/title/')) {
              result['release'] = t.children[0].data.trim();
            }
          });

          result['poster'] = $('.slate_wrapper .poster a img')[0].attribs.src;
          // result['trailer'] = 'https://www.imdb.com' + $('.slate_wrapper .slate a')[0].attribs.href;

          $('.credit_summary_item').filter((i, c) => {
            let type;
            c.children.filter((child, index) => {
              if (child.name === 'h4') {
                type = child.children[0].data.toLowerCase().slice(0, -1);
                result[type] = [];
              }
            });
            c.children.filter((child, index) => {
              if (child.name === 'a' && type) {
                if (child.children[0].data.indexOf('See full cast') === -1 && child.children[0].data.indexOf('more credits') === -1) {
                  result[type].push(child.children[0].data);
                }
              }
            });
          });

          observer.next(result);

        });
    });
  }

}
