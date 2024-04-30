import { Component, Input, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkWithHref } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonText, IonLabel, IonButtons, IonButton, IonBackButton, IonItem, IonNav, IonAvatar, } from '@ionic/angular/standalone';
import { MovieService } from 'src/services/movie.service';
import { MovieResult } from 'src/services/interfaces';
import { CurrencyPipe, DatePipe} from '@angular/common';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonText, IonLabel, IonButtons, IonButton, IonBackButton, IonItem, DatePipe, CurrencyPipe, IonNav, IonAvatar, RouterLinkWithHref, ]
})
export class DetailsPage implements OnInit {
  private movieService = inject(MovieService);
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public movie:WritableSignal<MovieResult | null> = signal(null);
  public homepage:string = "";

  @Input()
  set id(movieId:string) {
    this.movieService.getMovieDetails(movieId).subscribe((movie) => {
      console.log(movie);

      this.movie.set(movie);
      this.homepage = movie.homepage;
    });

  }

  async openMovieWebsite() {
    await Browser.open({ url: this.homepage});
  }

  constructor() { }

  ngOnInit() {
  }

}
