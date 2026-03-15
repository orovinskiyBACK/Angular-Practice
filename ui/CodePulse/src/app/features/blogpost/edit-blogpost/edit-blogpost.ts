import { Component, effect, inject, input } from '@angular/core';
import { BlogPostService } from '../services/blog-post-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category-service';
import { UpdateBlogPostRequest } from '../models/blogpost.model';
import { Router } from '@angular/router';
import { ImageSelector } from '../../../shared/components/image-selector/image-selector';
import { ImageSelectorService } from '../../../shared/components/services/image-selector-service';

@Component({
  selector: 'app-edit-blogpost',
  imports: [ReactiveFormsModule, MarkdownModule, ImageSelector],
  templateUrl: './edit-blogpost.html',
  styleUrl: './edit-blogpost.css',
})
export class EditBlogpost {
  id = input<string>();
  blogPostService = inject(BlogPostService);
  categoryService = inject(CategoryService);
  router = inject(Router);
  imageSelectorService = inject(ImageSelectorService);

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
      validators: [Validators.required]
    }),
    urlHandle: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required],
    }),
    publishedDate: new FormControl<string>(new Date().toISOString().split('T')[0],{
      nonNullable: true,
      validators: [Validators.required],
    }),
    author: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required],
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

  onDelete(){
    const id = this.id();
    if (id){
      this.blogPostService.deleteBlogPodt(id).subscribe({
        next: (response)=>{
          this.router.navigate(['/admin/blogpost']);
        },
        error: () =>{
          console.error("wrong!")
        }
      })
    }
  }

  onSubmit(){
    const id = this.id();
    console.log(this.editBlogPostForm.valid);
    if (id && this.editBlogPostForm.valid){
      const rawFormValues = this.editBlogPostForm.getRawValue();
      const updateBlogPostRequestDto: UpdateBlogPostRequest = {
        title: rawFormValues.title,
        shortDescription: rawFormValues.shortDescription,
        content: rawFormValues.content,
        author: rawFormValues.author,
        featuredImageUrl: rawFormValues.featuredImageUrl,
        urlHandle: rawFormValues.urlHandle,
        publishedDate: new Date(rawFormValues.publishedDate),
        isVisible: rawFormValues.isVisible,
        categories: rawFormValues.categories ?? [],
      };

      this.blogPostService.updateBlogPost(id, updateBlogPostRequestDto)
      .subscribe({
        next: (response)=>{
          this.router.navigate(['/admin/blogpost']);
        },
        error: () => {
          console.error("Something wrong");
        }
      });
    }
  }

  openImageSelector (){
    this.imageSelectorService.displayeImageSelector();
  }
}
