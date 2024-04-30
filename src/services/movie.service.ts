import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResult, MovieResult, TrailerResult} from './interfaces';

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

  getMovieDetails(id:string): Observable<MovieResult> {
    return this.httpClient.get<MovieResult>(BASE_URL + "/movie/" + id + "?api_key=" + API_KEY);
  }

  getSearchDetails(page = 1, searchTerm:string): Observable<ApiResult> {
    searchTerm.toLowerCase().trim().replace(" ", "+");
    return this.httpClient.get<ApiResult>(BASE_URL + "/search/movie?api_key=" + API_KEY + "&query=" + searchTerm);
  }

  getTrailerDetails(id:string): Observable<TrailerResult> {
    return this.httpClient.get<TrailerResult>('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + API_KEY + '&language=en-US&append_to_response=videos');
  }
}
