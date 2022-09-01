import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable ,Output} from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShortUrlRequestModel } from './header/shorturl-request';
import { ShortUrlResponseModel } from './header/shorturl-response';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  baseUrl = environment.baseUrl;

  @Output() id: EventEmitter<number> = new EventEmitter();

  constructor(private http:HttpClient, private localStorage: LocalStorageService) { }

  createShortUrl(shortUrlModel: ShortUrlRequestModel): Observable<ShortUrlResponseModel>{
    return this.http.post<ShortUrlResponseModel>(this.baseUrl, 
      shortUrlModel).pipe(map(data => {

        this.localStorage.store('shortUrlId', data.id);
        this.id.emit(data.id);
        return data;
      }));

      
  }
  getId(){
    return this.localStorage.retrieve('shortUrlId');
  }

  getRedirectById(id: number): Observable<ShortUrlResponseModel>{
    return this.http.get<ShortUrlResponseModel>(this.baseUrl + "by-id/" + id);
  }

  validURL(str: string) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }
}
