import { Component, effect, inject, input } from '@angular/core';
import { BlogPostService } from '../services/blog-post-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category-service';

@Component({
  selector: 'app-edit-blogpost',
  imports: [ReactiveFormsModule, MarkdownModule],
  templateUrl: './edit-blogpost.html',
  styleUrl: './edit-blogpost.css',
})
export class EditBlogpost {
  id = input<string>();
  blogPostService = inject(BlogPostService);
  categoryService = inject(CategoryService);

  private blogPostRef = this.blogPostService.getBlogPost(this.id);
  blogPostResponse = this.blogPostRef.value;

  private categoryRef = this.categoryService.getAllCategories();
  categoriesResponse = this.categoryRef.value;

   editBlogPostForm = new FormGroup({
    title: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100), Validators.minLength(10)],
    }),
    shortDescription: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(300), Validators.minLength(10)],
    }),
    content: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    featuredImageUrl: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    urlHandle: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    publishedDate: new FormControl<string>(new Date().toISOString().split('T')[0],{
      nonNullable: true,
      validators: [Validators.required],
    }),
    author: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    isVisible: new FormControl<boolean>(true,{
      nonNullable: true
    }),
    categories: new FormControl<string[]>([],{

    }),
  });

  effectRef = effect(()=>{
    if (this.blogPostResponse()){
      this.editBlogPostForm.patchValue({
      title: this.blogPostResponse()?.title,
      shortDescription: this.blogPostResponse()?.shortDescription,
      content: this.blogPostResponse()?.content,
      author: this.blogPostResponse()?.author,
      featuredImageUrl: this.blogPostResponse()?.featuredImageUrl,
      isVisible: this.blogPostResponse()?.isVisible,
      publishedDate: new Date(this.blogPostResponse()?.publishedDate!).toISOString().split('T')[0],
      urlHandle: this.blogPostResponse()?.urlHandle,
      categories: this.blogPostResponse()?.categories.map(x =>x.id),
    })
    }
  });

  onSubmit(){
    const rawFormValues = this.editBlogPostForm.getRawValue();
    console.log(rawFormValues);
  }
}
