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
import { MovieResult } from 'src/services/interfaces';
import { RouterLinkWithHref } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonAvatar, IonSkeletonText, IonAlert, IonBadge, RouterLinkWithHref, DatePipe, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonButton, IonButtons, IonBackButton, ],
})
export class SearchPage {
  private movieService = inject(MovieService);
  private currentPage:number = 1;
  public error = null;
  public isLoading:boolean = false;
  public isEmpty:boolean = true;
  public movies:MovieResult[] = [];
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public dummyArray = new Array(5);
  public index = 1;
  public searchTerm:any = "";

  constructor() {
    
  }

  loadMoreMovies(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.getMovieSearch();
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

  
}
