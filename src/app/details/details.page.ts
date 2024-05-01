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
   IonRadio, } from '@ionic/angular/standalone';
import { MovieService } from 'src/services/movie.service';
import { MovieResult } from 'src/services/interfaces';
import { CurrencyPipe, DatePipe} from '@angular/common';
import { Browser } from '@capacitor/browser';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Storage } from '@ionic/storage-angular';

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
    IonRadio, 
  ]
})



export class DetailsPage implements OnInit {
  private movieService = inject(MovieService);
  public imageBaseUrl = "https://image.tmdb.org/t/p";
  public movie:WritableSignal<MovieResult | null> = signal(null);
  public homepage:string = "";
  public startingState:boolean = true;
  public isChecked:boolean = this.startingState;
  public status:string = "";

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

  toggleClicked(): void {
    this.isChecked = !this.isChecked;
    
    if (this.isChecked) {
      // !!!!! ACTIVATE POPUP !!!!!
    }
  }

  async ionViewWillEnter() {
    await this.storage.create();
    this.status = await this.storage.get('status');
    //await console.log("hi" + this.storage.get('state'));
  }

  async saveStatus() {
    await this.storage.set('status', "val")
    .catch(error=>{
      alert(error);
      }
    );
    console.log("saveStatus() Running");
    console.log("Value" + this.storage.get('status'));
  }

  constructor(private storage: Storage) { 
    this.ionViewWillEnter();
    this.saveStatus();

  }

  ngOnInit() {
  }

}
