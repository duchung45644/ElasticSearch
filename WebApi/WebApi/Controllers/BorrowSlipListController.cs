using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WebApi.Helper;
using System;
using WebApi.Models.Request;
using Microsoft.Extensions.Configuration;
using WebApi.Services;
using WebApi.Models;
using DocumentFormat.OpenXml.EMMA;
using System.Linq;

namespace WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize(Policy = Policies.Admin)]

    public class BorrowSlipListController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonService _baseService;

        private readonly IBorrowSlipListService _BorrowSlipListService;
        private AppConfiguration appConfiguration;

        public BorrowSlipListController(IConfiguration configuration,
            ICommonService baseService, IBorrowSlipListService BorrowSlipListService)
        {
            _baseService = baseService;
            _configuration = configuration;
            _BorrowSlipListService = BorrowSlipListService;
            appConfiguration = new AppConfiguration(configuration);
        }


        [HttpPost]
        public IActionResult GetBorrowSlipList([FromBody] GetByPageRequest request)
        {
            try
            { 
                var borrowSlipList = _BorrowSlipListService.GetBorrowSlipList(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = borrowSlipList
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetBorrowSlipList");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }



    }
}
