using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using WebApi.Helper;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]

    [Authorize(Policy = Policies.Admin)]
    public class AccessmonitorController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IAccessmonitorService _accessmonitorService;
        private AppConfiguration appConfiguration;
        public AccessmonitorController(IConfiguration configuration,
            IAccessmonitorService baseService)
        {
            _accessmonitorService = baseService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }

       
        [HttpPost]
        public IActionResult GetByPage([FromBody] GetByPageRequest request)
        {
            try
            {
                var accessmonitors = _accessmonitorService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = accessmonitors
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "AccessmonitorGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        



    }

}
