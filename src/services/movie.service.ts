import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResult, MovieResult} from './interfaces';

// Movie service user the free API service available on "The Movie Database" at themoviedb.org

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = environment.apiKey;

@Injectable({
  providedIn: 'root'
})

export class MovieService {

  private httpClient = inject(HttpClient);

  constructor() { }

  getTopCharts(page = 1): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(BASE_URL + "/movie/popular?page=" + page + "&api_key=" + API_KEY);
  }

}
