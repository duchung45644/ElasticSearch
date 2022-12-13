using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Helper;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]

    [Authorize(Policy = Policies.Admin)]
    public class DocumentArchiveController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IDocumentArchiveService _documentArchiveService;
        private readonly IRecordService _recordService;
        private AppConfiguration appConfiguration;
        public DocumentArchiveController(IConfiguration configuration,
            ICacheProviderService CacheProvider,
            IConfigurationService configurationService,
            IStaffService staffService,
            IRecordService recordService,
            IDocumentArchiveService documentArchiveService) : base(configurationService, CacheProvider, configuration, staffService)
        {
            _recordService = recordService;
            _documentArchiveService = documentArchiveService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult SaveDocumentArchive([FromBody] DocumentArchiveModel model)
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

                    response = _documentArchiveService.Create(model);
                }
                else
                {
                    response = _documentArchiveService.Update(model);
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
                var records = _recordService.GetById(request.RecordId);
                var documentArchive = _documentArchiveService.GetByPage(request);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = records,
                    DocumentArchive = documentArchive
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
        public IActionResult GetById([FromBody] GetByIdRequest<long> request)
        {
            try
            {
                var documentArchive = _documentArchiveService.GetById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = documentArchive,
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetById");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetByRecordId([FromBody] GetByIdRequest<long> request)
        {
            try
            {
                var documentArchive = _documentArchiveService.GetByRecordId(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = documentArchive,
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetById");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult Delete(DocumentArchiveModel model)
        {
            try
            {
                Response response = _documentArchiveService.Delete(model);
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
    }
}
