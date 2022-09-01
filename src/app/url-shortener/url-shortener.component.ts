import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Observable, throwError } from 'rxjs';
import { ShortUrlRequestModel } from '../header/shorturl-request';
import { ShortUrlResponseModel } from '../header/shorturl-response';
import { RedirectService } from '../redirect.service';

@Component({
  selector: 'app-url-shortener',
  templateUrl: './url-shortener.component.html',
  styleUrls: ['./url-shortener.component.css']
})
export class UrlShortenerComponent implements OnInit {

  createShortUrlForm: FormGroup;
  shortUrlRequestModel: ShortUrlRequestModel;
  shortUrlResponseModel: ShortUrlResponseModel;
  shortUrl!: string;
  longUrl!: string;
  aliasAvailable!: boolean;
  emptyUrl!: boolean;
  


  url = new FormControl('');
  alias = new FormControl('');

  constructor(private redirectService: RedirectService, 
    private clipBoardService: ClipboardService) { 
      
      this.aliasAvailable = true;

    this.createShortUrlForm = new FormGroup({
      url: new FormControl('', Validators.required),
      alias: new FormControl('')
    });

    this.shortUrlRequestModel = {
      url: '',
      alias: ''
    };

    this.shortUrlResponseModel = {
      id: 0,
      url: '',
      shortenedUrl: ''
    };
  }

  ngOnInit(): void {
    this.aliasAvailable = true;
    this.emptyUrl = false;
  }


  makeLilUrl(){
    const userUrl = this.createShortUrlForm.get('url')?.value;

    if(userUrl != null && userUrl != '' && this.redirectService.validURL(userUrl)){
        this.emptyUrl = false;

        this.shortUrlRequestModel.url = this.createShortUrlForm.get('url')?.value;
        this.shortUrlRequestModel.alias = this.createShortUrlForm.get('alias')?.value;

        
        this.redirectService.createShortUrl(this.shortUrlRequestModel).subscribe({
          next: () => {
            this.getShortUrlById(this.redirectService.getId());
            this.changeDiv();
          },
          error: (e) => {
             throwError(() => new Error(e.error.message));
            this.aliasAvailable = false;
          },      
          complete: () => this.aliasAvailable = true
      });
    }

    else{
      this.shortUrlRequestModel.url = '';
      this.emptyUrl = true;
    }

  }

  changeDiv(){
    if(this.aliasAvailable){
      var resultDiv = <HTMLFormElement>document.getElementById('shortenedUrlDiv');
      var mainDiv = <HTMLFormElement>document.getElementById('homeDiv');
      resultDiv.style.display = 'block';
      mainDiv.style.display = 'none';
    } 
  }

  getShortUrlById(id: number): void {
    this.redirectService.getRedirectById(id).subscribe({
      next: (data) => {
        this.shortUrl = data.shortenedUrl;
        this.longUrl = data.url;
      },
      complete: () => console.log("Success")
    });

  }


  makeAnother(){
    (<HTMLInputElement>document.getElementById('user-url'))!.value = '';
    (<HTMLInputElement>document.getElementById('user-alias'))!.value = '';
    
    this.createShortUrlForm.patchValue({
      url: '', 
      alias: ''
    });


    var resultDiv = <HTMLFormElement>document.getElementById('shortenedUrlDiv');
    var mainDiv = <HTMLFormElement>document.getElementById('homeDiv');
    resultDiv.style.display = 'none';
    mainDiv.style.display = 'block';

  }

  copyContent(){
    const shortUrl = (<HTMLInputElement>document.getElementById("short-url"))!.value;
    this.clipBoardService.copyFromContent(shortUrl);
  }

  

}
