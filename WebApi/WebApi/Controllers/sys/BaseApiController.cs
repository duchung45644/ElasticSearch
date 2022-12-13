using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using WebApi.Helper;
using WebApi.Models;
using WebApi.Services;

namespace WebApi.Controllers
{ 
    public class BaseApiController : ControllerBase
    {
        public readonly IConfiguration _configuration;
        public readonly IStaffService _staffService;
        public readonly IConfigurationService _configurationService;
       

        public AppConfiguration appConfiguration;
        public readonly ICacheProviderService _cacheProvider;
        public BaseApiController(IConfigurationService configurationService,
                                 ICacheProviderService cacheProvider,
                                 IConfiguration configuration,
                                 IStaffService staffService
                                )
        {
            _configurationService = configurationService;
            _cacheProvider = cacheProvider;

            appConfiguration = new AppConfiguration(configuration);
            _configuration = configuration;
            _staffService = staffService;
           
        }

        public IEnumerable<ConfigurationModel> GetConfigurationByCode(string code)
        {
            var data =
             _cacheProvider.Get(Constants.CacheKey.ConfigurationKey) as List<ConfigurationModel>;

            if (data == null)
            {
                data = _configurationService.GetAllConfiguration().ToList();
                _cacheProvider.Set(Constants.CacheKey.ConfigurationKey, data, appConfiguration.CacheInMinutes);
            }
            return data.Where(x => x.Code == code).ToList();
        }
        public StaffModel GetStaffLogin()
        {
            string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
            var data =
            _cacheProvider.Get("LoginUser"+ userId) as StaffModel;

            if (data == null)
            {
                data = _staffService.GetStaffById(Convert.ToInt32(userId));
                _cacheProvider.Set("LoginUser" + userId, data, appConfiguration.CacheInMinutes);
            }
            return data;
        }

        public int  GetStaffIdLogin()
        {
            string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
            return Convert.ToInt32(userId);
        }
    }
}
