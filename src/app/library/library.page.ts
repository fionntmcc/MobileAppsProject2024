// All necessary imports
import { Component, inject } from '@angular/core';
import {
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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
  IonButton,
  IonButtons,
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
} from '@ionic/angular/standalone';
//import { DatePipe } from '@angular/common';
import { MovieService } from 'src/services/movie.service';
import { catchError } from 'rxjs';
import { MovieResult } from 'src/services/interfaces';
import { RouterLinkWithHref } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss'],
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
    IonInfiniteScrollContent, IonSearchbar, 
    IonButton, 
    IonButtons, 
    IonBackButton, 
    IonSelect, 
    IonSelectOption, 
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
],
})
export class LibraryPage {
  // inject services
  private movieService = inject(MovieService);
  private storageService = inject(StorageService);
  
  // Necessary inits
  public error = null;
  public movies: MovieResult[] = [];
  public ratings: number[] = [];
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public dummyArray = new Array(5);
  public topThree:number[] = [];

  constructor() {
  }

  ionViewWillEnter() {
    // reset variables
    this.movies = [];
    this.topThree = [];
    this.error = null;
    
    // load watched movies and reset fields
    this.loadMovies();
  }

  // loads watched movies and sorts them by user's rating
  loadMovies() {
    this.error = null;

    // get keys from database 
    // (keys are movieIds)
    this.storageService.keySet()
      // promise returned, use .then().catch() block
      .then(keys => {
        console.log("Keyset:" + keys);

        // loop through movieIds
        for (let i = 0; i < keys.length; i++) {
          // call for movieId api movie details
          this.movieService.getMovieDetails(keys[i]).pipe(
            // if error
            catchError((e) => {
              console.log(e);
              this.error = e.error.status_message;
              return [];
            })
          )
            // creates an Observable
            .subscribe({
              // returned MovieResult
              next: (resultMovie) => {
                // get user's rating for movie
                this.storageService.get(keys[i])
                  // promise returned, use .then().catch() block
                  .then((res:number) => {
                    // set vote_average to user's rating
                    resultMovie.vote_average = res;
                    //push movie to array
                    this.movies.push(resultMovie);

                    // sort movies by user's rating
                    this.movies.sort((a, b) => {
                      return b.vote_average - a.vote_average;
                    });
                    for (let j = 0; j < 3; j++) {
                      this.topThree[j] = this.movies[j].id;
                    }

                  })
                  // if error
                  .catch((e) => {
                    console.log("Error: " + e);
                  });
              }
            });
        }
        // end of for loop

        // Below is my failed attempt to sort the movies by ratings, however it will be 
        // easier to sort the returned array of movies than database entries
        // responseKeys.sort((a, b) => (await this.storageService.get(a) - await this.storageService.get(b)));

        // I tried sorting the movies array here like this: 
        /*
          this.movies.sort((a, b) => {
            return a.vote_average - b.vote_average;
          });
        */
        // However this would sort the movies based on their ratings from IMDb.
        // I am not sure why it does this but I think it has to do with asynchronous calls.
        // I made sure not to push resultMovie to the array prior to changing vote_average,
        // so I am not quite sure what is causing this behaviour.

      })
      // if error
      .catch(e => {
        console.log("Error: " + e);
      });
  }


  // event called by "Sort By" dropdown
  sortChange(value:string) {
    console.log("Sort By: " + value);
    // sort movies by user's preference ()
    this.movies.sort((a, b) => {
      if (value === "ratingAsc") { return a.vote_average - b.vote_average; }
      else if (value === "ratingDesc") { return b.vote_average - a.vote_average; }
      return (a.title.localeCompare(b.title));
    });
  }

  /*
    --- Methods to interact with DB ---
    All methods call storageService asynchronously
  */
  
  // set watchedMovie
  async set(key: string, value: number) {
    return await this.storageService.set(key, value);
  }

  // get watchedMovie
  async get(key: string) {
    return await this.storageService.get(key);
  }

  // get watchedMovie
  async keySet() {
    return await this.storageService.keySet();
  }

  // remove watchedMovie
  async removeWatchedMovie(id: string) {
    await this.storageService.remove(id);
  }

  /*
    --- End of DB methods ---
  */
}