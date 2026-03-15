using CodePulse.API.Data;
using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using CodePulse.API.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace CodePulse.API.Controllers
{
    // https://localhost:xxxx/api/categories
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository categoryRepository;

        public CategoriesController(ICategoryRepository categoryRepository)
        {
            this.categoryRepository = categoryRepository;
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequestDto request)
        {
            // Map Dto to Domain Model
            var category = new Category
            {
                name = request.name,
                UrlHandle = request.UrlHandle,
            };

            await categoryRepository.CreateAsync(category);

            // Domain model to DTO
            var response = new CategoryDto
            {
                Id = category.Id,
                Name = category.name,
                UrlHandle = category.UrlHandle
            };
            return Ok(response);
        }

        // Get: https://localhost:7002/api/Categories
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await categoryRepository.GetAllAsync();

            // Map domain model to dto

            var response = new List<CategoryDto>();
            foreach (var category in categories)
            {
                response.Add(new CategoryDto
                {
                    Id = category.Id,
                    Name = category.name,
                    UrlHandle = category.UrlHandle
                });
            }
            return Ok(response);
        }

        //Get  https://localhost:7002/api/Categories/{id}
        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetCategoryById([FromRoute] Guid id)
        {
            var existingCategory = await categoryRepository.GetById(id);

            if (existingCategory is null)
            {
                return NotFound();
            }

            var response = new CategoryDto
            {
                Id = existingCategory.Id,
                Name = existingCategory.name,
                UrlHandle = existingCategory.UrlHandle
            };

            return Ok(response);
        }

        // Put https://localhost:7002/api/Categories/{id}
        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> EditCategory([FromRoute] Guid id, UpdateCategoryRequestDto request)
        {
            //Covert Dto to domain model
            var category = new Category
            {
                Id = id,
                name = request.name,
                UrlHandle = request.UrlHandle
            };
            
            category = await categoryRepository.UpdateAsync(category);

            if (category is null)
            {
                return NotFound();
            }

            // Convert to Dto
            var response = new CategoryDto
            {
                Id = category.Id,
                Name = category.name,
                UrlHandle = category.UrlHandle
            };

            return Ok(response);
        }

        //Delete https://localhost:7002/api/Categories/{id}
        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteCategory([FromRoute] Guid id) {
            var category = await categoryRepository.DeleteAsync(id);

            if (category is null)
            {
                return NotFound();
            }

            // convert domain model to dto
            var response = new CategoryDto
            {
                Id = category.Id,
                Name= category.name,
                UrlHandle= category.UrlHandle
            };

            return Ok(response);

        }
    }
}
