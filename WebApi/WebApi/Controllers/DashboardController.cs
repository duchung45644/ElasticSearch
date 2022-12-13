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
    public class DashboardController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IDashboardService _dashboardService;
        private AppConfiguration appConfiguration;
        public DashboardController(IConfiguration configuration,
             ICacheProviderService CacheProvider,
            IConfigurationService configurationService,
            IStaffService staffService,
            IDashboardService baseService) : base(configurationService, CacheProvider, configuration, staffService)
        {
            _dashboardService = baseService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetDashboard([FromBody] GetByPageRequest request)
        {
            try
            {
                var staff = this.GetStaffLogin();
                request.UnitId = staff.UnitId;
                var Dashboards = _dashboardService.GetDashboard(request.UnitId);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = Dashboards
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DashboardGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
       
    }
}
