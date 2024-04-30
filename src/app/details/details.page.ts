import { Component, Input, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonText, IonLabel, IonItem, } from '@ionic/angular/standalone';
import { MovieService } from 'src/services/movie.service';
import { MovieResult } from 'src/services/interfaces';
import { CurrencyPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonText, IonLabel, IonItem, DatePipe, CurrencyPipe, ]
})
export class DetailsPage implements OnInit {

  private movieService = inject(MovieService);
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public movie:WritableSignal<MovieResult | null> = signal(null);

  @Input()
  set id(movieId:string) {
    this.movieService.getMovieDetails(movieId).subscribe((movie) => {
      console.log(movie);

      this.movie.set(movie);
    });

  }

  constructor() { }

  ngOnInit() {
  }

}
