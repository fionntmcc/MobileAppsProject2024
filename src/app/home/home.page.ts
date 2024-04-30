import { Component, inject, } from '@angular/core';
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
 } from '@ionic/angular/standalone';
import { MovieService } from 'src/services/movie.service';
import { finalize, catchError} from 'rxjs';
import { RouterLinkWithHref } from '@angular/router';
import { MovieResult } from 'src/services/interfaces';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonAvatar, IonSkeletonText, IonAlert, IonBadge, RouterLinkWithHref, DatePipe, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonButton, IonButtons, ],
})
export class HomePage {

  private movieService = inject(MovieService);
  private currentPage:number = 1;
  public movies:MovieResult[] = [];
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public error = null;
  public isLoading:boolean = false;
  public index = 1;
  public fakeArray = new Array(5);


  constructor() {
    this.loadMovies();
    console.log(this.movies);
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
}
