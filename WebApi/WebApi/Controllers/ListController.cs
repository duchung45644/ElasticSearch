﻿using System;
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

    public class ListController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonService _baseService;

        private readonly IListService _ListService;
        private AppConfiguration appConfiguration;

        public ListController(IConfiguration configuration,
            ICommonService baseService, IListService ListService)
        {
            _baseService = baseService;
            _configuration = configuration;
            _ListService = ListService;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult SaveAddinformation([FromBody] DocofrequestModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
       
               
                {
                    response = _ListService.UpdateAddinformation(model);
                }
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,
                    response.ReturnId
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "InitReport");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetByID([FromBody] GetByIdRequest<int> request)
        {
            try
            {

                var registrasionlists = _ListService.GetByID(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = registrasionlists
                });
            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetByID");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult GetByID_List([FromBody] GetByIdRequest<long> request)
        {
            try
            {
                var file = _ListService.GetByID_List(request.bigId);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = file
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetByID_List");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult GetByIDListView([FromBody] GetByIdRequest<int> request)
        {
            try
            {

                var registrasionlists = _ListService.GetByIDListView(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = registrasionlists
                });
            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetByIDListView");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetByIDDocView([FromBody] GetByIdRequest<int> request)
        {
            try
            {

                var registrasionlists = _ListService.GetByIDDocView(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = registrasionlists
                });
            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetByIDDocView");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }


        [HttpPost]
        public IActionResult GetByPage([FromBody] GetByPageRequest request)
        {
            try
            {
                var cates = _ListService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = cates
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "ListGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetAllStaff()
        {
            try
            {

                var staff = _ListService.GetAllStaff();

                return Ok(new
                {
                    Message = "Thành Công.",
                    Success = true,
                    Data = staff
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "GetAllBorrowrequest");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

       

    }
}
