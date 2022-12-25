using Microsoft.AspNetCore.Mvc;
using Nest;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models.ElasticSearch;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    //[Authorize(Policy = Policies.Admin)]
    public class ElasticController : ControllerBase
    {
        private readonly IElasticClient elasticClient;

        public ElasticController(IElasticClient elasticClient)
        {
            this.elasticClient = elasticClient;
        }

        // GET api/<UsersController>/5
        //[HttpGet("{id}")]
        //public async Task<User> Get(string id)
        //{
        //    var response = await elasticClient.SearchAsync<User>(s => s
        //        .Index("users")
        //        .Query(q => q.Match(m => m.Field(f => f.Name).Query(id))));

        //    return response?.Documents?.FirstOrDefault();
        //}

        [HttpGet("{id}")]
        public async Task<Document> Get(string id)
        {
            var response = await elasticClient.SearchAsync<Document>(s => s
                .Index("documents")
                .Query(q => q.Match(m => m.Field(f => f.Content).Query(id))));

            return response?.Documents?.FirstOrDefault(); 
        }

        //[HttpPost]
        //public void Post([FormBody] User value)
        //{

        //}
    }
}
