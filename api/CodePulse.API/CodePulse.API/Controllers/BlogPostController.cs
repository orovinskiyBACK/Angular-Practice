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

        public BlogPostController(IBlogPostRepository blogPostRepository)
        {
            this.blogPostRepository = blogPostRepository;
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
                UrlHandle = request.UrlHandle
            };

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
                Title = blogpost.Title
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
                    Title = blogpost.Title
                });
            }

            return Ok(response);
        }
    }
}
