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
    public class RecordController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IRecordService _recordService;
        private AppConfiguration appConfiguration;
        public RecordController(IConfiguration configuration,
            ICacheProviderService CacheProvider,
            IConfigurationService configurationService,
            IStaffService staffService,
            IRecordService recordService) : base(configurationService, CacheProvider, configuration, staffService)
        {
            _recordService = recordService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)
        {
            try
            {
                var Records = _recordService.GetAll().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Records = Records
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "RecordGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetAllLanguage([FromBody] GetByPageRequest request)
        {
            try
            {
                var Language = _recordService.GetAllLanguage().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = Language
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "RecordGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetAllMaintenance([FromBody] GetByPageRequest request)
        {
            try
            {
                var Language = _recordService.GetAllMaintenance().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = Language
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "RecordGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetAllRights([FromBody] GetByPageRequest request)
        {
            try
            {
                var Language = _recordService.GetAllRights().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = Language
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "RecordGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult SaveRecord([FromBody] RecordModel model)
        {
            try
            {

                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);

                var staff = this.GetStaffLogin();
                model.UnitId = staff.UnitId;

                if (model.Id == 0)
                {

                    response = _recordService.Create(model);
                }
                else
                {
                    response = _recordService.Update(model);
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

                Logger.LogError(ex, "SaveRecord");
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
                var records = _recordService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = records
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetByPage");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult Delete(RecordModel model)
        {
            try
            {
                Response response = _recordService.Delete(model);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "Delete");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
        [HttpPost]
        public IActionResult DeleteRecord([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _recordService.DeleteRecord(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,

                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteRecord");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
        [HttpPost]
        public IActionResult GetFileCodeByDeparment(GetByPageRecordRequest request)
        {
            try
            {
                var staff = this.GetStaffLogin();
                request.UnitId = staff.UnitId;

                var FileCode = _recordService.GetFileCodeByDepartment(request.UnitId, request.FileCatalog, request.FileNotation);

                return Ok(new
                {
                    Message = "Thành công",
                    Success = true,
                    Data = FileCode
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetFileCodeByDeparment");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
        [HttpPost]
        public IActionResult StaffGetByUnit(GetByPageRequest request)
        {
            try
            {
                var staff = this.GetStaffLogin();
                request.UnitId = staff.UnitId;

                var StaffByUnit = _staffService.GetAllByUnitId(request).ToList();

                return Ok(new
                {
                    Message = "Thành công",
                    Success = true,
                    Data = StaffByUnit
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "StaffGetByUnit");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }

        [HttpPost]
        public IActionResult GetById(GetByIdRequest<int> request)
        {
            try
            {
                var records = _recordService.GetById(request.Id);

                return Ok(new
                {
                    Message = "Thành công",
                    Success = true,
                    Data = records
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "StaffGetByUnit");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }

        [HttpPost]
        public IActionResult SaveFormativeRecord(RecordModel model)
        {
            try
            {
                var records = _recordService.SaveFormativeRecord(model);

                return Ok(new
                {
                    Message = "Thành công",
                    Success = true,
                    Data = records
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "StaffGetByUnit");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }

        [HttpPost]
        public IActionResult LostRecord(RecordModel model)
        {
            try
            {
                var records = _recordService.LostRecord(model);

                return Ok(new
                {
                    Message = "Thành công",
                    Success = true,
                    Data = records
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "StaffGetByUnit");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }

        [HttpPost]
        public IActionResult WaitDestroyRecord(RecordModel model)
        {
            try
            {
                Response response = _recordService.WaitDestroyRecord(model);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "ChangeStatus");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
        [HttpPost]
        public IActionResult CancelRecord(RecordModel model)
        {
            try
            {
                Response response = _recordService.CancelRecord(model);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "ChangeStatus");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
        [HttpPost]
        public IActionResult UpdateStorageStatus([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _recordService.UpdateStorageStatus(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,

                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "UpdateStorageStatus");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
        [HttpPost]
        public IActionResult GetExtention([FromBody] GetByPageRequest request)

        {
            try
            {
                var doc = _recordService.GetExtention().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = doc
                   
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "PositionGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

    }
}
