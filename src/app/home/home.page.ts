import { Component, inject, } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { MovieService } from 'src/services/movie.service';
import { finalize, catchError} from 'rxjs';
import { MovieResult } from 'src/services/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {

  private movieService = inject(MovieService);
  private currentPage:number = 1;
  public movies:MovieResult[] = [];

  constructor() {
    this.loadMovies(this.currentPage);
  }

  loadMovies(page:number) {
    this.movieService.getTopCharts(page).subscribe((movies) => {
    console.log(movies);
    });
  }
}
