import { Component, inject, } from '@angular/core';
import { IonHeader,
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
 } from '@ionic/angular/standalone';
import { MovieService } from 'src/services/movie.service';
import { StorageService } from 'src/services/storage.service';
import { finalize, catchError} from 'rxjs';
import { RouterLinkWithHref } from '@angular/router';
import { MovieResult } from 'src/services/interfaces';
import { DatePipe } from '@angular/common';
import { IonicStorageModule } from '@ionic/storage-angular';


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
],
})
export class HomePage {

  private movieService = inject(MovieService);
  private storageService = inject(StorageService);
  private currentPage:number = 1;
  public movies:MovieResult[] = [];
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public error = null;
  public isLoading:boolean = false;
  public index = 1;
  public fakeArray = new Array(5);
  public watchedMovieIds:string[] = [];
  public id:string = "";
  public value:string = "";


  constructor() {
    this.getWatchedMovies();
    this.loadMovies();
    console.log(this.movies);
  }

  getWatchedMovies() {
    this.keySet()
    .then((res) => {
      this.watchedMovieIds = res;
      console.log(this.watchedMovieIds);
    })
    .catch((e) => {
      console.log("Error: " + e);
    });
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    this.movieService.getTopCharts(this.currentPage).pipe(
      finalize(() => {
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      }),
      catchError((e) => {
        console.log(e);
        this.error = e.error.status_message;
        return [];
      })  
    )
    .subscribe({
      next: (res) => {
        console.log(res);
        this.movies.push(...res.results);
        if (event) {
          event.target.disabled = res.total_pages === this.currentPage;
        }
      },
    });

    this.movieService.getTopCharts().subscribe((movies) => {
      console.log(movies);
    });
  }

  getMovieFromId(id:string):void {
    this.movieService.getMovieDetails(id).subscribe((movie) => {
      console.log(movie);
    });
  }

  loadMoreMovies(event?: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }

  // Methods to retrieve from DB
  async keySet() {
    return await this.storageService.keySet();
  }
}
