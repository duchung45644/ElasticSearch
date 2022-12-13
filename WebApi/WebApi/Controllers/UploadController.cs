using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using WebApi.Helper;
using WebApi.Models;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize(Policy = Policies.Admin)]
    public class UploadController : ControllerBase
    {

        private readonly IWebHostEnvironment _evn;

        private AppConfiguration appConfiguration;

        public UploadController(IWebHostEnvironment evn, IConfiguration configuration)
        {
            _evn = evn;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost, DisableRequestSizeLimit]
        public IActionResult UploadImage()
        {
            try
            {
                var file = Request.Form.Files[0];
                var sub = DateTime.Now.ToString("yyyy//MM//dd");
                var folderName = Path.Combine("Resources", "Images", DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString(), DateTime.Now.Day.ToString());
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string ext = Path.GetExtension(fileName);
                    var newname = DateTime.Now.ToString("hh-mm-ss") + ext;

                    var fullPath = Path.Combine(pathToSave, newname);
                    if (!Directory.Exists(pathToSave))
                    {
                        Directory.CreateDirectory(pathToSave);
                    }
                    var dbPath = Path.Combine(folderName, newname);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    var filesResult = new UploadFilesResult()
                    {
                        Success = true,
                        Url = dbPath,
                        Name = fileName
                    };

                    return Ok(filesResult);
                }
                else
                {
                    var filesResult = new UploadFilesResult()
                    {
                        Success = false,
                        Message = "Không tìm thấy file",
                        Url = "",
                        Name = ""
                    };

                    return Ok(filesResult);
                }
            }
            catch (Exception ex)
            {
                var filesResult = new UploadFilesResult()
                {
                    Success = false,
                    Message = "Có lỗi xảy ra." + ex.Message,
                    Url = "",
                    Name = ""
                };

                return Ok(filesResult);
            }
        }
        [HttpPost, DisableRequestSizeLimit]
        public IActionResult UploadPDF()
        {
            try
            {
                var file = Request.Form.Files[0];
                var sub = DateTime.Now.ToString("yyyy//MM//dd");
                var folderName = Path.Combine("Resources", "File", DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString(), DateTime.Now.Day.ToString());
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string ext = Path.GetExtension(fileName);
                    var newname = DateTime.Now.ToString("hh-mm-ss") + ext;

                    var fullPath = Path.Combine(pathToSave, newname);
                    if (!Directory.Exists(pathToSave))
                    {
                        Directory.CreateDirectory(pathToSave);
                    }
                    var dbPath = Path.Combine(folderName, newname);

                    using (var stream = new FileStream(fullPath, FileMode.OpenOrCreate))
                    {
                        file.CopyTo(stream);
                    }

                    var filesResult = new UploadFilesResult()
                    {
                        Success = true,
                        Url = dbPath,
                        Name = fileName
                    };

                    return Ok(filesResult);
                }
                else
                {
                    var filesResult = new UploadFilesResult()
                    {
                        Success = false,
                        Message = "Không tìm thấy file",
                        Url = "",
                        Name = ""
                    };

                    return Ok(filesResult);
                }
            }
            catch (Exception ex)
            {
                var filesResult = new UploadFilesResult()
                {
                    Success = false,
                    Message = "Có lỗi xảy ra." + ex.Message,
                    Url = "",
                    Name = ""
                };

                return Ok(filesResult);
            }
        }
        [HttpPost, DisableRequestSizeLimit]
        public IActionResult UploadFile(string subPath)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(subPath)) subPath = "Images";
                //string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                //string userobj = User.Claims.First(c => c.Type == Policies.UserObject).Value;
                //var user = Newtonsoft.Json.JsonConvert.DeserializeObject< User>(userobj);
                //subPath = $"{user.UnitId}/{subPath}";
                var file = Request.Form.Files[0];
                var sub = DateTime.Now.ToString("yyyy//MM//dd");
                var folderName = Path.Combine("Resources", subPath, DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString(), DateTime.Now.Day.ToString());
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string ext = Path.GetExtension(fileName);
                    var newname = DateTime.Now.ToString("hh-mm-ss") + ext;

                    var fullPath = Path.Combine(pathToSave, newname);
                    if (!Directory.Exists(pathToSave))
                    {
                        Directory.CreateDirectory(pathToSave);
                    }
                    var dbPath = Path.Combine(folderName, newname);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    var filesResult = new UploadFilesResult()
                    {
                        Success = true,
                        Url = dbPath,
                        Name = fileName
                    };

                    return Ok(filesResult);
                }
                else
                {
                    var filesResult = new UploadFilesResult()
                    {
                        Success = false,
                        Message = "Không tìm thấy file",
                        Url = "",
                        Name = ""
                    };

                    return Ok(filesResult);
                }
            }
            catch (Exception ex)
            {
                var filesResult = new UploadFilesResult()
                {
                    Success = false,
                    Message = "Có lỗi xảy ra." + ex.Message,
                    Url = "",
                    Name = ""
                };

                return Ok(filesResult);
            }
        }



        //[HttpPost, DisableRequestSizeLimit]
        //public IActionResult ImportAssets()
        //{
        //    try
        //    {
        //        var httpRequest = HttpContext.Request;
        //        var sub = DateTime.Now.ToString("yyyy//MM//dd");
        //        var folderName = Path.Combine(Constants.RootFolder, Constants.TempFolder, DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString(), DateTime.Now.Day.ToString());
        //        var pathToSave = Path.Combine(_evn.ContentRootPath, folderName);
        //        if (!Directory.Exists(pathToSave))
        //        {
        //            Directory.CreateDirectory(pathToSave);
        //        }
        //        if (httpRequest.Form.Files.Count > 0)
        //        {
        //            for (var f = 0; f < httpRequest.Form.Files.Count; f++)
        //            {
        //                var postedFile = httpRequest.Form.Files[f];
        //                var files = new List<IFormFile>();
        //                files.Add(postedFile);

        //                foreach (var file in files)
        //                {
        //                    using (var ms = new MemoryStream())
        //                    {
        //                        file.CopyTo(ms);
        //                        var fileBytes = ms.ToArray();

        //                        var table = ExcelHelper.ReadToTable(ms, 3, 1);

        //                        var listAssets = new List<AssetsUnitsModel>();
        //                        foreach (DataRow row in table.Rows)
        //                        {
        //                            if (row[1] != null && !string.IsNullOrWhiteSpace(row[1].ToString()))
        //                            {
        //                                var assets = new AssetsUnitsModel();
        //                                //todo: set value 
        //                                assets.AccountantCode = row[1].ToString();
        //                                assets.AssetsName = row[2].ToString();
        //                                assets.AssetsDes = row[3].ToString();
        //                                assets.AssetsYear = row[4].ToString();
        //                                assets.AssetsState = row[5].ToString();
        //                                assets.AssetsWarranty = row[6].ToString();
        //                                assets.AssetsPrice = Convert.ToInt64(row[7].ToString());
        //                                assets.PurchaseDate = Convert.ToDateTime(row[8].ToString());

        //                             //   if (row[7]!= null && !string.IsNullOrWhiteSpace(row[7].ToString()))
        //                             //   {
        //                             //        DateTime purcharDate = DateTime.ParseExact(row[7].ToString(), "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
        //                             //
        //                             //   assets.PurchaseDate = purcharDate;
        //                             //   }
        //                                assets.AssetsContract = row[9].ToString();
        //                                assets.DVTName = row[10].ToString();
        //                                if (row[11] != null && !string.IsNullOrWhiteSpace(row[11].ToString()))
        //                                {

        //                                    assets.intSoluong = Convert.ToInt32(row[11].ToString());
        //                                }

        //                                assets.CategoriesCode = row[12].ToString();
        //                                assets.CateCode = row[13].ToString();
        //                                assets.UserCode = row[14].ToString();
        //                                assets.AddCode = row[15].ToString();
        //                                assets.SituationName = row[16].ToString();










        //                                listAssets.Add(assets);
        //                            }
        //                        }
        //                        string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;

        //                        var response = _assetsService.ImportAssets(listAssets, Convert.ToInt32(userId));

        //                        string dataError = "";
        //                        //todo: Nếu cần trả về danh sách
        //                        /*
        //                        string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        //                        string fileName = "";
        //                        string fileUrl = "";
        //                        string dataError = "";
        //                        var members = new List<AssetsModel>();
        //                        if (response.Success)
        //                        {
        //                            fileName = pathToSave + "/ImportAssets.xlsx";
        //                            fileUrl = folderName + "/ImportAssets.xlsx";
        //                            try
        //                            {
        //                                using (var workbook = new XLWorkbook())
        //                                {
        //                                    IXLWorksheet worksheet = workbook.Worksheets.Add("Assets");
        //                                    var curentRow = 1;
        //                                    worksheet.Cell(curentRow, 1).Value = "STT";
        //                                    worksheet.Cell(curentRow, 2).Value = "ID tài sản";
        //                                    worksheet.Cell(curentRow, 3).Value = "Tên ";
        //                                    foreach (var item in response.Objs)
        //                                    {
        //                                        item.Password = appConfiguration.DefaultPassword;
        //                                        curentRow++;
        //                                        worksheet.Cell(curentRow, 1).Value = curentRow - 1;
        //                                        worksheet.Cell(curentRow, 2).Value = item.ID;
        //                        -......
        //                                    }
        //                                    var ntFirstCell = worksheet.Cell(1, 1);
        //                                    var ntLastCell = worksheet.Cell(curentRow, 6);
        //                                    var namesTable = worksheet.Range(ntFirstCell, ntLastCell).CreateTable();
        //                                    namesTable.Theme = XLTableTheme.TableStyleLight10;
        //                                    namesTable.ShowAutoFilter = false;

        //                                    worksheet.Columns().AdjustToContents();
        //                                    workbook.SaveAs(fileName);
        //                                }
        //                            }
        //                            catch (Exception ex)
        //                            {
        //                                dataError = ex.Message + ex.StackTrace;
        //                                //  return Error();
        //                            }
        //                        }
        //                        */
        //                        var filesResultOK = new
        //                        {
        //                            Success = response.Success,
        //                            Message = response.Message,
        //                            DataError = response.Objs,
        //                            Url = "",
        //                            Name = ""
        //                        };

        //                        return Ok(filesResultOK);
        //                    }
        //                }
        //            }
        //            var filesResult = new UploadFilesResult()
        //            {
        //                Success = false,
        //                Message = "Không thể tải file",
        //                Url = "",
        //                Name = ""
        //            };

        //            return Ok(filesResult);
        //        }
        //        else
        //        {
        //            var filesResult = new UploadFilesResult()
        //            {
        //                Success = false,
        //                Message = "Không tìm thấy file",
        //                Url = "",
        //                Name = ""
        //            };

        //            return Ok(filesResult);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        var filesResult = new UploadFilesResult()
        //        {
        //            Success = false,
        //            Message = ex.Message + ex.StackTrace,
        //            Url = "",
        //            Name = ""
        //        };

        //        return Ok(filesResult);
        //    }
        //}
    }
}
