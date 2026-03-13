import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AddCategoryRequest } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiBaseUrl = 'https://localhost:7002'

  addCategory(category: AddCategoryRequest){
    this.http.post<void>(`${this.apiBaseUrl}/api/Categories`, category)
    .subscribe({
      next: () => {},
      error: () => {},
    });
  }
}
