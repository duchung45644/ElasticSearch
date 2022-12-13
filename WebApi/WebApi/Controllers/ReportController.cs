using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NetBarcode;
using QRCoder;
using WebApi.Helper;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Services;

namespace WebApi.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]

    public class ReportController : BaseApiController
    {
        private readonly IWebHostEnvironment _env;
        private readonly IAccessmonitorService _accessmonitorService;
        private readonly IDocofrequestService _DocofrequestService;

        public ReportController(IWebHostEnvironment env,
                                IConfigurationService configurationService,
                                ICacheProviderService cacheProvider,
                                IAccessmonitorService accessmonitorService,
                                IConfiguration configuration,
                              IDocofrequestService docofrequestService,
                                IStaffService staffService) : base(configurationService, cacheProvider, configuration, staffService)
        {
            _env = env;
            _accessmonitorService = accessmonitorService;
            _DocofrequestService = docofrequestService;
        }
        [HttpPost]
        public IActionResult BarCodeRecord([FromBody] GetByPageRequest request)
        {
            try
            {
                if (request == null || request.ListRecords == null || !request.ListRecords.Any())
                {
                    return Ok(new
                    {
                        Message = "Không có dữ liệu",
                        Success = false
                    });
                }

                foreach (var item in request.ListRecords)
                {
                    Barcode barcode = new Barcode(item.FileCode,NetBarcode.Type.Code128, true);
                    var image = barcode.GetBase64Image();
                    item.QRCodeStr = $"data:image;base64,{image}"; ;
                }

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = request.ListRecords
                });
            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "BarCodeAssets");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        ///
        public IActionResult DownloadExcelStatisAccessmonitor(
            string logbookborrowedForm,
            string ReceiveDate,
            string Title,
            string ReceiverName,
            string AppointmentDate,
            string ReimburseDate,
            int    Status,
            string start,
            string end
        )
        {
            string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            string fileName = $"ThongKeTinhHinhSangKien_{DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss")}.xlsx";
            var assets = _accessmonitorService.GetByPageExcelAccessmonitor(new GetByPageRequest
            {
                DateAddStart = start,
                DateAddEnd = end,
                logbookborrowedForm = logbookborrowedForm,
                ReceiveDate = ReceiveDate,
                AppointmentDate = AppointmentDate,
                ReimburseDate = ReimburseDate,
                Status = Status,
                Title = Title,
                ReceiverName = ReceiverName
            });
            DateTime dateStart = Convert.ToDateTime(start);
            DateTime dateEnd = Convert.ToDateTime(end);

            string s = dateStart.ToString("dd/MM/yyyy");
            string e = dateEnd.ToString("dd/MM/yyyy");

            string webRootPath = this._env.ContentRootPath;
            var fileUrl = appConfiguration.LogBookBorrowedTemplate;
            string newPath = webRootPath + fileUrl;

            byte[] content = null;
            //Started reading the Excel file.  
            using (var stream = new MemoryStream())
            {
                using (XLWorkbook workbook = new XLWorkbook(newPath))
                {
                    IXLWorksheet worksheet = workbook.Worksheet(1);

                    int startRow = 4;
                    if (assets.Count == 0)
                    {
                        return Ok(new
                        {
                            Message = "Không có dữ liệu",
                            Success = false
                        });
                    }
                    worksheet.Row(startRow).InsertRowsBelow(assets.Count);

                    for (int index = 1; index <= assets.Count; index++)
                    {
                        worksheet.Cell(startRow, 1).Value = index;
                        worksheet.Cell(startRow, 2).Value = assets[index - 1].ReceiverName;
                        worksheet.Cell(startRow, 3).Value = assets[index - 1].Title;
                        worksheet.Cell(startRow, 4).Value = assets[index - 1].ReceiveDate;
                        worksheet.Cell(startRow, 5).Value = assets[index - 1].AppointmentDate;
                        worksheet.Cell(startRow, 6).Value = assets[index - 1].ReimburseDate;
                        worksheet.Cell(startRow, 7).Value = assets[index - 1].Status;
                        //worksheet.Cell(startRow, 5).Value = assets[index - 1].CreateDate.ToString("dd/MM/yyyy hh:mm:ss");
                        startRow++;
                    }
                    workbook.SaveAs(stream);
                    content = stream.ToArray();
                }
                return File(content, contentType, fileName);
            }
        }

    }


    //////\


    //public IActionResult DownloadExcelLog(string start, string end, string I, string C, string SI, string D)
    //{

    //    string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    //    string fileName = $"Quanlyloi_{DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss")}.xlsx";
    //    var assets = _DocofrequestService.GetByPageAssetsPrint(new GetByPageRequest
    //    {
    //        DateAddStart = start,
    //        DateAddEnd = end,
    //        ErrorMessage = I,
    //        ObjectError = SI,
    //        InnerException = C,
    //        ErrorStackTrace = D
    //    });
    //    DateTime starte = Convert.ToDateTime(start);
    //    DateTime ende = Convert.ToDateTime(end);

    //    string s = starte.ToString("dd/MM/yyyy");
    //    string e = ende.ToString("dd/MM/yyyy");

    //    string webRootPath = this._env.ContentRootPath;
    //    var fileUrl = appConfiguration.ExcelDocof;
    //    string newPath = webRootPath + fileUrl;

    //    byte[] content = null;
    //    //Started reading the Excel file.  
    //    using (var stream = new MemoryStream())
    //    {
    //        using (XLWorkbook workbook = new XLWorkbook(newPath))
    //        {
    //            IXLWorksheet worksheet = workbook.Worksheet(1);

    //            int startRow = 6;
    //            if (assets.Count == 0)
    //            {
    //                return Ok(new
    //                {
    //                    Message = "Không có dữ liệu",
    //                    Success = false
    //                });
    //            }
    //            worksheet.Row(startRow).InsertRowsBelow(assets.Count);

    //            for (int index = 1; index <= assets.Count; index++)
    //            {

    //                worksheet.Cell(startRow, 1).Value = index;
    //                worksheet.Cell(startRow, 2).Value = assets[index - 1].ObjectError;
    //                worksheet.Cell(startRow, 3).Value = assets[index - 1].ErrorMessage;
    //                worksheet.Cell(startRow, 4).Value = assets[index - 1].InnerException;
    //                worksheet.Cell(startRow, 5).Value = assets[index - 1].ErrorDateTime.ToString("dd/MM/yyyy hh:mm:ss");
    //                //worksheet.Cell(startRow, 6).Value = assets[index - 1].ErrorStackTrace;

    //                startRow++;
    //            }



    //            workbook.SaveAs(stream);
    //            content = stream.ToArray();



    //        }


    //        return File(content, contentType, fileName);
    //    }

    //}
}
