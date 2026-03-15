import { NonNullAssert } from '@angular/compiler';
import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddCategoryRequest } from '../models/category.model';
import { CategoryService } from '../services/category-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class AddCategory {
  private router = inject(Router);
  constructor(){
    effect(()=>{
      if (this.categoryService.addCategoryStatus() === 'success'){
        this.categoryService.addCategoryStatus.set('idle');
        this.router.navigate(['/admin/categories']);
      }
      if (this.categoryService.addCategoryStatus() === 'error'){
        console.error('Add Category Request Failed');
      }
    });
  }

  private categoryService = inject(CategoryService)
  addCategoriesFormGroup = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)]
    }),
    urlHandle: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)]
    })
  });

  get nameFormControl(){
    return this.addCategoriesFormGroup.controls.name;
  }

  get urlHandleFormControl(){
    return this.addCategoriesFormGroup.controls.urlHandle;
  }

  onSubmit(){
    const addCategoryFormValue = this.addCategoriesFormGroup.getRawValue();

    const addCategoryRequestDto: AddCategoryRequest = {
      name: addCategoryFormValue.name,
      urlHandle: addCategoryFormValue.urlHandle
    };

    this.categoryService.addCategory(addCategoryRequestDto);
  }
}
