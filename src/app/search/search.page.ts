// All necessary imports
import { Component, inject } from '@angular/core';
import { IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    InfiniteScrollCustomEvent,
    SearchbarCustomEvent,
    IonList, 
    IonItem,
    IonLabel,
    IonAvatar,
    IonSkeletonText, 
    IonAlert,
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSearchbar,
    IonButton,
    IonButtons,
    IonBackButton,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonText,
   } from '@ionic/angular/standalone';
//import { DatePipe } from '@angular/common';
import { MovieService } from 'src/services/movie.service';
import { finalize, catchError } from 'rxjs';
import { MovieResult } from 'src/services/interfaces';
import { RouterLinkWithHref } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonAvatar, 
    IonSkeletonText, 
    IonAlert, 
    IonBadge, 
    RouterLinkWithHref, 
    DatePipe, 
    IonInfiniteScroll, 
    IonInfiniteScrollContent, 
    IonSearchbar, 
    IonButton, 
    IonButtons, 
    IonBackButton,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonText,
   ],
})
export class SearchPage {
  // inject services
  private movieService = inject(MovieService);
  private storageService = inject(StorageService);

  // necessary inits
  public currentPage:number = 1;
  public totalPages:number = 1;
  public totalMovies:number | null = null;
  public error = null;
  public isLoading:boolean = false;
  public isEmpty:boolean = true;
  public movies:MovieResult[] = [];
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public dummyArray = new Array(5);
  public searchTerm:any = "";
  public watchedMovieIds:string[] = []

  constructor() {}

  ionViewWillEnter() {
    // reset variables
    this.currentPage = 1;
    this.totalPages = 1;
    this.totalMovies = null;
    this.error = null;
    this.isLoading = false;
    this.isEmpty = true;
    this.movies = [];
    this.watchedMovieIds = [];

    // get keySet before starting page
    this.storageService.keySet()
    // pass res to watchedMovieIds
    .then((res) => {
      this.watchedMovieIds = res;
    })
    // if error
    .catch((e) => {
      console.log("Error: " + e);
    });
  }

  // loads more movies if there are more movies to load within search results
  loadMoreMovies(event?: InfiniteScrollCustomEvent) {
    // increment currentPage
    this.currentPage++;
    // load currentPage
    this.loadMovieSearch(event);
  }

  // eventListener reads searchbar value
  checkSearchbarValue(event:SearchbarCustomEvent) {

    // trim search value
    this.searchTerm = event.detail.value?.trim();

    // console.log(this.searchTerm);

    // empty movies array and set currentPage to 1
    this.movies = [];
    this.currentPage = 1;
    this.totalMovies = null;
    this.totalPages = 1;

    // if empty search term, display "Enter movie name"
    if (this.searchTerm === "") {
      this.isEmpty = true;
      this.isLoading = false;
    }
    // else search movie
    else {
      this.isEmpty = false;
      this.loadMovieSearch();
    }
    
  }

  // Builds array of movies returned by api
  loadMovieSearch(event?: InfiniteScrollCustomEvent) {

    this.error = null;

    if (!event) {
      this.isLoading = true;
    }
    // get search details from movieService
    this.movieService.getSearchDetails(this.currentPage, this.searchTerm).pipe(
      finalize(() => {
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      }),
      // if error
      catchError((e) => {
        console.log(e);
        this.error = e.error.status_message;
      return[];
      })
    )
    // create Observable
    .subscribe({
      // promise returned, use .then().catch() block
      next: (res) => {
        console.log(res);

        // push movie to movies array
        this.movies.push(...res.results);

        // if first page, set totalPages and totalMovies
        if (this.currentPage == 1) { 
          this.totalPages = res.total_pages;
          this.totalMovies = res.total_results;
        }
        // disable target if currentPage is greater than or equal to totalPages
        if (event) {
          event.target.disabled = this.totalPages <= this.currentPage;
        }
      },
    });

    this.error = null;
}

    // Methods to retrieve from DB
    async keySet() {
      return await this.storageService.keySet();
    }
}
