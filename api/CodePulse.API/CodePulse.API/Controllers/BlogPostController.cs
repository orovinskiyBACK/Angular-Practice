using Azure.Core;
using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using CodePulse.API.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CodePulse.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogPostController : ControllerBase
    {
        private readonly IBlogPostRepository blogPostRepository;
        private readonly ICategoryRepository categoryRepository;

        public BlogPostController(IBlogPostRepository blogPostRepository, ICategoryRepository categoryRepository)
        {
            this.blogPostRepository = blogPostRepository;
            this.categoryRepository = categoryRepository;
        }

        //Post {apiBase}/api/blogpost
        [HttpPost]
        public async Task<IActionResult> CreateBlogPost([FromBody]CreateBlogPostRequestDto request)
        {
            // Conver dto to domain
            var blogpost = new BlogPost
            {
                Author = request.Author,
                Content = request.Content,
                FeaturedImageUrl = request.FeaturedImageUrl,
                IsVisible = request.IsVisible,
                PublishedDate = request.PublishedDate,
                ShortDescription = request.ShortDescription,
                Title = request.Title,
                UrlHandle = request.UrlHandle,
                Categories = new List<Category>()
            };

            // look through categories
            foreach (var categoryGuid in request.Categories) { 
                var existingCategory = await categoryRepository.GetById(categoryGuid);
                if (existingCategory is not null)
                {
                    blogpost.Categories.Add(existingCategory);
                }
            }

            blogpost = await blogPostRepository.CreateAsync(blogpost);

            // conver domain back to dto
            var response = new BlogPostDto
            {
                Id = blogpost.Id,
                Author = blogpost.Author,
                Content = blogpost.Content,
                FeaturedImageUrl = blogpost.FeaturedImageUrl,
                IsVisible = blogpost.IsVisible,
                PublishedDate = blogpost.PublishedDate,
                ShortDescription = blogpost.ShortDescription,
                UrlHandle = blogpost.UrlHandle,
                Title = blogpost.Title,
                Categories = blogpost.Categories.Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.name,
                    UrlHandle = x.UrlHandle
                }).ToList()
            };

            return Ok(response);
        }

        // get {apibase}/api/blogpost
        [HttpGet]
        public async Task<IActionResult> GetAllBlogPosts()
        {
            var blogPosts = await blogPostRepository.GetAllAsync();

            // convert to dto
            var response = new List<BlogPostDto>();
            foreach (var blogpost in blogPosts)
            {
                response.Add(new BlogPostDto
                {
                    Id = blogpost.Id,
                    Author = blogpost.Author,
                    Content = blogpost.Content,
                    FeaturedImageUrl = blogpost.FeaturedImageUrl,
                    IsVisible = blogpost.IsVisible,
                    PublishedDate = blogpost.PublishedDate,
                    ShortDescription = blogpost.ShortDescription,
                    UrlHandle = blogpost.UrlHandle,
                    Title = blogpost.Title,
                    Categories = blogpost.Categories.Select(x => new CategoryDto
                    {
                        Id = x.Id,
                        Name = x.name,
                        UrlHandle = x.UrlHandle
                    }).ToList()
                });
            }

            return Ok(response);
        }

        // Get {apibase}/api/blogpost/{id}
        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetBlogPostById([FromRoute]Guid id)
        {
            var blogpost = await blogPostRepository.GetByIdAsync(id);

            if (blogpost is null)
            {
                return NotFound();
            }

            var response = new BlogPostDto
            {
                Id = blogpost.Id,
                Author = blogpost.Author,
                Content = blogpost.Content,
                FeaturedImageUrl = blogpost.FeaturedImageUrl,
                IsVisible = blogpost.IsVisible,
                PublishedDate = blogpost.PublishedDate,
                ShortDescription = blogpost.ShortDescription,
                UrlHandle = blogpost.UrlHandle,
                Title = blogpost.Title,
                Categories = blogpost.Categories.Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.name,
                    UrlHandle = x.UrlHandle
                }).ToList()
            };

            return Ok(response);
        }

        //put {apibase}/api/blogpost/{id}
        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateBlogPostById([FromRoute] Guid id, [FromBody] UpdateBlogPostRequestDto request)
        {
            // Convert dto to domain
            var blogPost = new BlogPost
            {
                Id = id,
                Author = request.Author,
                Content = request.Content,
                FeaturedImageUrl = request.FeaturedImageUrl,
                IsVisible = request.IsVisible,
                PublishedDate = request.PublishedDate,
                ShortDescription = request.ShortDescription,
                Title = request.Title,
                UrlHandle = request.UrlHandle,
                Categories = new List<Category>()
            };

            // get all categories
            foreach (var categoryId in request.Categories) { 
                var existingCategory = await categoryRepository.GetById(categoryId);
                if (existingCategory != null)
                {
                    blogPost.Categories.Add(existingCategory);
                }
            }

            // call repostory to update blogpost domain model
            var blogpost = await blogPostRepository.UpdateAsync(blogPost);

            if (blogpost is null)
            {
                return NotFound();
            }

            var response = new BlogPostDto
            {
                Id = blogpost.Id,
                Author = blogpost.Author,
                Content = blogpost.Content,
                FeaturedImageUrl = blogpost.FeaturedImageUrl,
                IsVisible = blogpost.IsVisible,
                PublishedDate = blogpost.PublishedDate,
                ShortDescription = blogpost.ShortDescription,
                UrlHandle = blogpost.UrlHandle,
                Title = blogpost.Title,
                Categories = blogpost.Categories.Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.name,
                    UrlHandle = x.UrlHandle
                }).ToList()
            };

            return Ok(response);

        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteBlogsPost([FromRoute] Guid id)
        {
            var deletedBlogPost = await blogPostRepository.DeleteAsync(id);
            if (deletedBlogPost is null)
            {
                return NotFound();
            }
            // Convert Dto
            var response = new BlogPostDto
            {
                Id = deletedBlogPost.Id,
                Author = deletedBlogPost.Author,
                Content = deletedBlogPost.Content,
                FeaturedImageUrl = deletedBlogPost.FeaturedImageUrl,
                IsVisible = deletedBlogPost.IsVisible,
                PublishedDate = deletedBlogPost.PublishedDate,
                ShortDescription = deletedBlogPost.ShortDescription,
                UrlHandle = deletedBlogPost.UrlHandle,
                Title = deletedBlogPost.Title,
            };

            return Ok(response);
        }
    }
}
