import { Routes } from '@angular/router';
import { CategoryList } from './features/category/category-list/category-list';
import { AddCategory } from './features/category/add-category/add-category';
import { EditCategory } from './features/category/edit-category/edit-category';
import { BlogpostList } from './features/blogpost/blogpost-list/blogpost-list';
import { AddBlogpost } from './features/blogpost/add-blogpost/add-blogpost';
import { EditBlogpost } from './features/blogpost/edit-blogpost/edit-blogpost';

export const routes: Routes = [
    {
        path: 'admin/categories',
        component: CategoryList
    },
    {
        path: 'admin/categories/add',
        component: AddCategory
    },
    {
        path: 'admin/category/edit/:id',
        component: EditCategory
    },
    {
        path: 'admin/blogpost',
        component: BlogpostList
    },
    {
        path: 'admin/blogpost/add',
        component: AddBlogpost
    },
    {
        path: 'admin/blogpost/edit/:id',
        component: EditBlogpost
    }
];
