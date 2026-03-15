import { Component, effect, inject, input } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditCategoryRequest } from '../models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.css',
})
export class EditCategory {

  constructor(){
    effect(()=>{
      if (this.categoryService.updateCategoryStatus() === 'success'){
        this.categoryService.updateCategoryStatus.set('idle');
        this.router.navigate(['/admin/categories']);
      }
       if (this.categoryService.updateCategoryStatus() === 'error'){
        this.categoryService.updateCategoryStatus.set('idle');
        console.error('Something went wrong');
      }
    });
  }

  id = input<string>();
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categoryResourceRef= this.categoryService.getCategoryById(this.id);
  categoryResponse = this.categoryResourceRef.value;

  editCategoriesFormGroup = new FormGroup({
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
    return this.editCategoriesFormGroup.controls.name;
  }

  get urlHandleFormControl(){
    return this.editCategoriesFormGroup.controls.urlHandle;
  }

  effectRef = effect(() =>{
    this.editCategoriesFormGroup.controls.name.patchValue(this.categoryResponse()?.name ?? '');
    this.editCategoriesFormGroup.controls.urlHandle.patchValue(this.categoryResponse()?.urlHandle ?? '');
  });

  onSubmit(){
    const id = this.id()
    if (!this.editCategoriesFormGroup.valid || !id){
      return;
    }
    const formRawValue = this.editCategoriesFormGroup.getRawValue()

    const updateCategoryRequeatDto: EditCategoryRequest = {
      name: formRawValue.name,
      urlHandle: formRawValue.urlHandle
    }
    this.categoryService.editCategoryById(id,updateCategoryRequeatDto)
  }

  onDelete(){
    const id = this.id()
    if (!id){
      return;
    }

    this.categoryService.deleteCategory(id)
    .subscribe({
      next: () =>{
        this.router.navigate(['/admin/categories']);
      },
      error: () =>{
        console.error("No id");
      }
    });
  }
}
