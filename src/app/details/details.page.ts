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
   } from '@ionic/angular/standalone';
import { MovieService } from 'src/services/movie.service';
import { StorageService } from 'src/services/storage.service';
import { MovieResult, WatchedMovie } from 'src/services/interfaces';
import { CurrencyPipe, DatePipe} from '@angular/common';
import { Browser } from '@capacitor/browser';
import { Storage } from '@ionic/storage-angular';
import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormsModule, NgModel } from '@angular/forms';
import { delay } from 'rxjs';

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
  ]
})



export class DetailsPage implements OnInit {
  private movieService = inject(MovieService);
  private storageService = inject(StorageService);
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public movie:WritableSignal<MovieResult | null> = signal(null);
  public isChecked:boolean = false;
  public isPopupActive:boolean = false;
  public homepage:string = "";
  public status:string = "";
  public rating:number = 0;
  private movieId:string = "";

  @Input()
  set id(movieId:string) {
    this.movieService.getMovieDetails(movieId).subscribe((movie) => {
      console.log(movie);
      this.movie.set(movie); 
      this.homepage = movie.homepage;
      this.movieId = movieId;
    });

  }

  async openMovieWebsite() {
    await Browser.open({ url: this.homepage});
  }

  async toggleClicked() {
    this.isChecked = !this.isChecked;
    
    if (!this.isChecked) {
      await this.removeWatchedMovie();
      this.isPopupActive = false;
    } else { 
      this.isPopupActive = true;
    }
    console.log(this.isChecked);
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

  getToggleStartingValue():boolean {
    this.storageService.get(this.movieId)
    .then(response => {
      if (response === undefined) { return false; }
      return true;
    })
    .catch(e => {
      console.log("Error getting this movie's rating: " + e)
    })
    return false;
  }

  saveRating() {
    console.log(this.rating);
    if (this.rating >= 0 && this.rating <= 10) {
      // save rating
      this.addWatchedMovie();
      this.isPopupActive = false;
    } else {
      alert("Please enter a rating between 0 and 10.");
    }
    
  }

  constructor(private storage: Storage) { 
    // Get list of watched movies
    this.isChecked = this.getToggleStartingValue();
    this.getWatchedMovies();
    //this.storage.clear();
  }

  ngOnInit() {
  }

}
