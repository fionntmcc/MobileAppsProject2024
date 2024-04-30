import { Component, inject, } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList, IonAvatar, } from '@ionic/angular/standalone';
import { MovieService } from 'src/services/movie.service';
import { finalize, catchError} from 'rxjs';
import { MovieResult } from 'src/services/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList, IonAvatar, ],
})
export class HomePage {

  private movieService = inject(MovieService);
  private currentPage:number = 1;
  public movies:MovieResult[] = [];
  public imageBaseUrl = "https://image.tmdb.org/t/p";

  constructor() {
    this.loadMovies(this.currentPage);
    console.log(this.movies);
  }

  loadMovies(page:number) {
    this.movieService.getTopCharts(page).subscribe({
      next: (res) => {
        console.log(res);
        this.movies.push(...res.results);
      },
    });
  }
}
