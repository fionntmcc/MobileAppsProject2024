// All necessary imports
import { Component, inject, } from '@angular/core';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  InfiniteScrollCustomEvent,
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
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonCard,
  IonPopover,
  IonText,
 } from '@ionic/angular/standalone';
import { MovieService } from 'src/services/movie.service';
import { StorageService } from 'src/services/storage.service';
import { finalize, catchError} from 'rxjs';
import { RouterLinkWithHref } from '@angular/router';
import { MovieResult } from 'src/services/interfaces';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
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
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonCard,
    IonPopover,
    IonText,
],
})
export class HomePage {
  // inject services
  private movieService = inject(MovieService);
  private storageService = inject(StorageService);

  // Necessary inits
  private currentPage:number = 1;
  public movies:MovieResult[] = [];
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public error = null;
  public isLoading:boolean = true;
  public index = 1;
  public fakeArray = new Array(5);
  public watchedMovieIds:string[] = [];
  public id:string = "";
  public value:string = "";
  public isHelpOpen:boolean = false;


  constructor() {}

  ionViewWillEnter() {
    // reset variables
    this.currentPage = 1;
    this.movies = [];
    this.error = null;
    this.isLoading = false;
    this.watchedMovieIds = [];
    this.id = "";
    this.value = "";
    this.isHelpOpen= false;

    // retrieve watched movies
    this.loadWatchedMovies();
    // load movies
    this.loadMovies();
    
    console.log(this.movies);
  }

  // loads watched movie IDs from DB
  loadWatchedMovies() {
    // call keyset()
    this.keySet()
    // promise returned, use then().catch() block
    .then((res) => {
      this.watchedMovieIds = res;
      console.log(this.watchedMovieIds);
    })
    // if error
    .catch((e) => {
      console.log("Error: " + e);
    });
  }

  // initialises movies on page startup
  loadMovies(event?: InfiniteScrollCustomEvent) {

    this.error = null;

    // for skeleton list
    if (!event) {
      this.isLoading = true;
    }

    // get movies on currentPage
    this.movieService.getTopCharts(this.currentPage).pipe(
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
    // create Observable
    .subscribe({
      // use next() block
      next: (res) => {
        // print movie to console
        console.log(res);
        // push movie to movies array
        this.movies.push(...res.results);
        // disable InfiniteScroll if total pages equals current page
        if (event) {
          event.target.disabled = res.total_pages === this.currentPage;
        }
      },
    });
  }

  // loads next page of movies when scrolling
  loadMoreMovies(event?: InfiniteScrollCustomEvent) {
    // increment currentPage
    this.currentPage++;
    // load movies on currentPage
    this.loadMovies(event);
  }

  displayHelp() {
    this.isHelpOpen = true;
  }

  /*
    --- Methods to interact with DB ---
  */

  // keySet() method returns all keys from DB. 
  // This is needed to retrieve watched movie IDs.
  async keySet() {
    return await this.storageService.keySet();
  }

  /*
    --- End of DB methods ---
  */
}
