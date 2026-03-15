import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogPostService } from '../services/blog-post-service';
import { AddBlogPostRequest } from '../models/blogpost.model';
import { Router } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-add-blogpost',
  imports: [ReactiveFormsModule, MarkdownComponent],
  templateUrl: './add-blogpost.html',
  styleUrl: './add-blogpost.css',
})
export class AddBlogpost {
  blogPostService = inject(BlogPostService);
  router = inject(Router);
  
  addBlogPostForm = new FormGroup({
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
  });

  onSubmit(){
    const rawFormValues = this.addBlogPostForm.getRawValue();
    const requestDto : AddBlogPostRequest = {
      title: rawFormValues.title,
      shortDescription: rawFormValues.shortDescription,
      content: rawFormValues.content,
      author: rawFormValues.author,
      featuredImageUrl: rawFormValues.featuredImageUrl,
      urlHandle: rawFormValues.urlHandle,
      publishedDate: new Date(rawFormValues.publishedDate),
      isVisible: rawFormValues.isVisible
    }
    
    this.blogPostService.createBlogPost(requestDto)
    .subscribe({
      next: (response)=>{
        console.log(response);

        this.router.navigate(['/admin/blogpost']);
      },
      error: (err)=>{
        console.error(err);
      }
    });
  }
}
