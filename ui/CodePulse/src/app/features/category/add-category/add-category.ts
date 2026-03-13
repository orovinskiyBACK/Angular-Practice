import { NonNullAssert } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddCategoryRequest } from '../models/category.model';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class AddCategory {
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
    }
  }
}
