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
   } from '@ionic/angular/standalone';
//import { DatePipe } from '@angular/common';
import { MovieService } from 'src/services/movie.service';
import { finalize, catchError} from 'rxjs';
import { MovieResult, WatchedMovie } from 'src/services/interfaces';
import { RouterLinkWithHref } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonAvatar, IonSkeletonText, IonAlert, IonBadge, RouterLinkWithHref, DatePipe, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonButton, IonButtons, IonBackButton, ],
})
export class LibraryPage {
  private movieService = inject(MovieService);
  private storageService = inject(StorageService);
  private currentPage:number = 1;
  public error = null;
  public isLoading:boolean = false;
  public isEmpty:boolean = true;
  public movies:Array<MovieResult> = [];
  public sortedMovies:Array<MovieResult> = [];
  public ratings:number[] = [];
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public dummyArray = new Array(5);
  public index = 1;
  public searchTerm:any = "";
  
  constructor() {
    this.loadMovies();
    console.log(this.movies);
    console.log(this.ratings);
  }

  loadMoreMovies(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    //this.getMovieSearch();
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    this.storageService.keySet()
    .then(keys => {
      console.log("Keyset:" + keys);

      // Below is my failed attempt to sort the movies by ratings, however it will be 
      // easier to sort the returned array of movies than database entries
      // responseKeys.sort((a, b) => (await this.storageService.get(a) - await this.storageService.get(b)));
      
      for (let i = 0; i < keys.length; i++) {

        this.movieService.getMovieDetails(keys[i]).pipe(
          catchError((e) => {
            console.log(e);
            this.error = e.error.status_message;
            return [];
          })
        )
        .subscribe({
          next: (resultMovie) => {
            this.storageService.get(keys[i])
        .then( (res:number) => {
          console.log(i);
          console.log("Vote avg idx " + i + " before:" + resultMovie.vote_average);
          this.movies[i].vote_average = res;
          console.log("Vote avg idx " + i + " after:" + resultMovie.vote_average);
          this.ratings.push(res);
        })
        .catch((e) => {
          console.log("Error: " + e);
        });
        this.movies.push(resultMovie);
          }
        });
      }
      this.sortedMovies = this.movies.sort((a, b) => {
        if (a.vote_average > b.vote_average) { return 1; }
        return -1;
      });
      console.log("movies");
      console.log(this.sortedMovies);
      console.log("ratings");
    })
    .catch(e => {
      console.log("Error: " + e);
    });

    /*
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
    */
  }

  getSearchbarValue(event:SearchbarCustomEvent) {
    this.movies = [];
    this.searchTerm = event.detail.value?.trim();
    console.log(this.searchTerm);
    if (this.searchTerm === "") {
      this.isEmpty = true;
    }
    else {
      this.isEmpty = false;
      this.getMovieSearch();
    }
    
  }

  getMovieSearch() {

    if (this.searchTerm != null) {
      this.movieService.getSearchDetails(1, this.searchTerm).pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((e) => {
          console.log(e);
          this.error = e.error.status_message;
        return[];
        })
      )
      .subscribe({
        next: (res) => {
          console.log("Results" + res);
  
          this.movies.push(...res.results);
          res.total_pages === this.currentPage;
        },
      });
    }
}

  getMovieFromId(id:string):void {
    this.movieService.getMovieDetails(id).subscribe((movie) => {
      console.log(movie);
    });
  }

  // Methods to interact with DB
  async set(key:string, value:number) {
    return await this.storageService.set(key, value);
  }

  async get(key:string) {
    return await this.storageService.get(key);
  }

  async keySet() {
    return await this.storageService.keySet();
  }

  async removeWatchedMovie(id:string) {
    await this.storageService.remove(id);
  }
}