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
import { Storage } from '@ionic/storage-angular';
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

  // Necessary inits
  public currentPage:number = 1;
  public totalPages:number = 100;
  public error = null;
  public isLoading:boolean = false;
  public isEmpty:boolean = true;
  public movies:MovieResult[] = [];
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public dummyArray = new Array(5);
  public index = 1;
  public searchTerm:any = "";
  public watchedMovieIds:string[] = []

  constructor() {
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
    this.currentPage++;
    this.loadMovieSearch(event);
  }

  /*
  // initialises movies on page startup
  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    // for skeleton list
    if (!event) {
      this.isLoading = true;
    }
    
    // get movies on currentPage
    this.movieService.getTopCharts(this.currentPage).pipe(
      // response returned
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
        return [];
      })  
    )
    // create observable
    .subscribe({
      next: (res) => {
        // print movieResult to console
        console.log(res);

        this.totalPages = res.total_pages;

        // push movieResult to movies array
        this.movies.push(...res.results);

        // disable scroll of currentPage equals total_pages
        if (event) {
          event.target.disabled = this.totalPages === this.currentPage;
        }
      },
    });
    
  }
  */

  // eventListener reads searchbar value
  checkSearchbarValue(event:SearchbarCustomEvent) {
    // trim search value
    this.searchTerm = event.detail.value?.trim();
    console.log(this.searchTerm);
    // if empty search term, display "Enter movie name"
    if (this.searchTerm === "") {
      this.isEmpty = true;
    }
    // else search movie
    else {
      // delete existing movies and set currentPage to 1
      this.movies = [];
      this.currentPage = 1;
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
      catchError((e) => {
        console.log(e);
        this.error = e.error.status_message;
      return[];
      })
    )
    .subscribe({
      next: (res) => {
        console.log(res);

        this.movies.push(...res.results);
        if (this.currentPage == 1) { this.totalPages = res.total_pages; }
        console.log(this.currentPage);
        if (event) {
          event.target.disabled = res.total_pages === this.currentPage;
        }
      },
    });

    this.error = null;
}

  getMovieFromId(id:string):void {
    this.movieService.getMovieDetails(id).subscribe((movie) => {
      console.log(movie);
    });
  }

    // Methods to retrieve from DB
    async keySet() {
      return await this.storageService.keySet();
    }
}
