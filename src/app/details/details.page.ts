// All necessary imports
import { Component, Input, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { IonContent,
   IonHeader, 
   IonTitle, 
   IonToolbar, 
   IonIcon, 
   IonCard, 
   IonCardHeader, 
   IonCardTitle, 
   IonCardSubtitle, 
   IonCardContent, 
   IonText, 
   IonLabel, 
   IonButtons, 
   IonButton, 
   IonBackButton, 
   IonItem, 
   IonNav, 
   IonAvatar,
   IonToggle,
   IonPopover,
   IonInput,
   IonRadio,
   IonBadge,
   } from '@ionic/angular/standalone';
import { MovieService } from 'src/services/movie.service';
import { StorageService } from 'src/services/storage.service';
import { MovieResult, WatchedMovie } from 'src/services/interfaces';
import { CurrencyPipe, DatePipe} from '@angular/common';
import { Browser } from '@capacitor/browser';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonIcon, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonCardContent, 
    IonText, 
    IonLabel, 
    IonButtons, 
    IonButton,
    IonBackButton, 
    IonItem, 
    DatePipe, 
    CurrencyPipe, 
    IonNav, 
    IonAvatar, 
    RouterLinkWithHref,
    IonToggle,
    IonPopover,
    IonInput,
    IonRadio, 
    FormsModule,
    IonBadge,
  ]
})



export class DetailsPage implements OnInit {
  // inject services
  private movieService = inject(MovieService);
  private storageService = inject(StorageService);

  // Necessary inits
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public movie:WritableSignal<MovieResult | null> = signal(null);
  public isChecked:boolean = false;
  public isPopupActive:boolean = false;
  public homepage:string = "";
  public status:string = "";
  public rating:number | null = null;
  public ratingInput:number = 0;
  public movieId:string = "";

  @Input()
  set id(movieId:string) {
    this.movieService.getMovieDetails(movieId).subscribe((movie) => {
      console.log(movie);
      this.movie.set(movie); 
      this.homepage = movie.homepage;
      this.movieId = movieId;
      this.getRating();
    });

  }

  async openMovieWebsite() {
    await Browser.open({url: this.homepage});
  }

  async toggleClicked() {
    this.isChecked = !this.isChecked;
    if (!this.isChecked) {
      await this.removeWatchedMovie();
      this.isPopupActive = false;
      this.rating = null;
    } else { 
      this.isPopupActive = true;
    }
    console.log(this.isChecked);
  }

  getRating() {
    this.get(this.movieId)
    .then((res) => {
      this.rating = res;
      this.setToggleStartingValue();
    })
    .catch((e) => {
      console.log("Error: " + e);
    });
  }

  // Methods to interact with DB
  async set(key:string, value:number) {
    return await this.storageService.set(key, value);
  }

  async get(key:string) {
    return await this.storageService.get(key);
  }

  async removeWatchedMovie() {
    await this.storageService.remove(this.movieId);
  }

  async getWatchedMovies() {
    const keys = await this.storageService.keySet();
    console.log("All keys: " + keys);
    for (let i = 0; i < keys.length; i++) {
      const rating = await this.storageService.get(keys[i]);
      console.log("Key: " + keys[i] + "  -  Value: " + rating);      
    }
  }

  // Retrieves list of watchedMovies from database,
  // adds current movie to list,
  // and uploads new list to database
  async addWatchedMovie() {
    await this.storageService.set(this.movieId, this.rating);
  }

  setToggleStartingValue() {
    if (this.rating == null) { this.isChecked = false; }
    else {this.isChecked = true; }
  }

  saveRating() {
    console.log(this.ratingInput);
    if (this.ratingInput >= 0 && this.ratingInput <= 10) {
      // save rating
      this.rating = this.ratingInput;
      this.addWatchedMovie();
      this.isPopupActive = false;
    } else {
      this.rating = null;
      alert("Please enter a rating between 0 and 10.");
    }
    
  }

  constructor() { 
    // Get list of watched movies
    this.getWatchedMovies();
  }

  ngOnInit() {
  }

}
