import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Language  } from './../data-type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private environmentUrl = environment.apiUrl;  
  private languageApiUrl = this.environmentUrl + 'languages';

  constructor(private http: HttpClient) {}

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(this.languageApiUrl);
  }

  getLanguageById(id: number): Observable<Language> {
    return this.http.get<Language>(`${this.languageApiUrl}/${id}`);
  }

  createLanguage(language: Language): Observable<Language> {    
    return this.http.post<Language>(this.languageApiUrl, language);
  }
  updateLanguage(languageId: number, languageData: any): Observable<any> {
    const url = `${this.languageApiUrl}/${languageId}`;
    return this.http.put(url, languageData); 
  }

  deleteLanguage(id: number): Observable<Language> {
    const updatedLanguage = { id, active: false };
    return this.http.patch<Language>(`${this.languageApiUrl}/${id}`, updatedLanguage );
  }


}