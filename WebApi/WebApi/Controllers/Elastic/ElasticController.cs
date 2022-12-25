using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApi.Models.ElasticSearch;
using WebApi.Services.ElasticSearch;

namespace WebApi.Controllers.Elastic
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    
    public class ElasticController : ControllerBase
    { 
        private IElasticDocumentService _elasticDocumentService;

        public ElasticController(IElasticDocumentService elasticDocumentService)
        {
            _elasticDocumentService = elasticDocumentService;
        }

        [HttpGet]
        public async Task<IActionResult> CreateIndex(string index)
        {
            //If index not exists, create it
            await _elasticDocumentService.CheckIndex(index);

            // Add status index exists
            return Ok("Create " + index + " successfully!");
        }
        
        [HttpGet] 
        public async Task<IActionResult> DeleteIndex(string index)
        {
            //If index not exists, create it
            await _elasticDocumentService.DeleteIndex(index);

            return Ok("Delete " + index + " successfully!");
        }

        [HttpGet]
        public async Task<IActionResult> GetDocumentById(string index ,string id)
        {
            //Get document by Id in index
            Document getDocuments = await _elasticDocumentService.GetDocumentById(index, id);

            return Ok(getDocuments);
        }


        // Full ---------------------------------------------------------
        [HttpGet]
        public async Task<IActionResult> Get(string id)
        {
            #region InsertFullData
            await InsertFullData();
            #endregion

            #region If index not exists, create it
            //await _elasticDocumentService.ChekIndex("cities");
            #endregion

            #region Delete by id
            //await _elasticDocumentService.DeleteByIdDocument("cities", new Cities { Id = "c651489f-43fa-4a19-97c9-f789e8f630fd", City = "Rize" });
            #endregion

            #region Delete Index
            // await _elasticDocumentService.DeleteIndex("cities");
            #endregion

            #region Get Data by Id
            //Document getDocuments = await _elasticDocumentService.GetDocumentById("documents", id);
            #endregion

            #region Insert data by id
            //       await _elasticDocumentService.InsertDocument("cities", new Cities { City = "EskişehirEskişehirEskişehirEskişehirEskişehir", CreateDate = System.DateTime.Now, Id = Guid.NewGuid().ToString(), Population = 50000, Region = "İç Anadolu" });
            #endregion

            #region Data update process by id
            // await _elasticDocumentService.InsertDocument("cities", new Cities { City = "Bolu", CreateDate = System.DateTime.Now, Id = "", Population = 50000, Region = "Karadeniz" });
            #endregion

            #region Get All
            //List<Document> documents = await _elasticDocumentService.GetAllDocuments("documents");
            #endregion

            return Ok();
        }
        // Full ---------------------------------------------------------

        [HttpGet]
        public async Task<IActionResult> Insert(string index) 
        {
            // Insert data

            await _elasticDocumentService.InsertDocument("documents", new Document {Uid = "Uid", Title="Tiêu đề văn bản nhé", Content = "test insert", Filepath="C://asdfghasjdfgbasjkhdfbc" });

            return Ok("Insert successfully!");
        }

        private async Task InsertFullData()
        {
            var documentsList = new [] {
                new Document{Uid="Ankara",Title="cak c 1 ak cakk ",Content="cak  2  ehehehehehhe",Filepath="fil  3  e path"},
                new Document{Uid="İzmir",Title="cak ca 1 k cakk ",Content="cak  2  hehehehehhe",Filepath="file  3   path"},
                new Document{Uid="Aydın",Title="cak ca 1 k cakk ",Content="cak  2  hehehehehhe",Filepath="file  3   path"},
                new Document{Uid="Rize",Title="cak cak 1  cakk ",Content="cak  2  ehehehehhe",Filepath="file   3  path"},
                new Document{Uid="İstanbul",Title="cak 1  cak cakk ",Content="cak  2  ehehehehehehhe",Filepath="f  3  ile path"},
                new Document{Uid="Sinop",Title="cak ca 1 k cakk ",Content="cak  2  hehehehehhe",Filepath="file  3   path"},
                new Document{Uid="Kars",Title="cak cak 1  cakk ",Content="cak  2  ehehehehhe",Filepath="file   3  path"},
                new Document{Uid="Van",Title="cak cak  1 cakk ",Content="cak  2  hehehehhe",Filepath="file p  3  ath"},
                new Document{Uid="Adıyaman",Title="cak 1  cak cakk ",Content="cak  2  ehehehehehehhe",Filepath="f  3  ile path"},
            };
            await _elasticDocumentService.InsertBulkDocuments("documents", documentsList);
        }




        #region GET data in index:documents
        [HttpPut]
        public async Task<IActionResult> GetDocumentsWildcard(string value) 
        {
            //Get all documents by wildcard words.
            List<Document> documents = await _elasticDocumentService.WildcardGetDocuments(value);

            return Ok(documents);
        }
        [HttpGet]
        public async Task<IActionResult> GetDocumentsByFuzzyWord(string value)
        {
            //Get all documents by fuzzy words
            List<Document> documents = await _elasticDocumentService.GetDocumentsByFuzzyWord(value);

            return Ok(documents);
        }

        [HttpGet]
        public async Task<IActionResult> GetDocumentsByMatchPrefix(string value)
        {
            //Get all documents by match pharse prefix
            List<Document> documents = await _elasticDocumentService.GetDocumentsByMatchPrefix(value);

            return Ok(documents);
        }

        [HttpGet]
        public async Task<IActionResult> GetDocumentsByMultiMatch(string value) 
        {
            //Get all documents by match pharse multi field
            List<Document> documents = await _elasticDocumentService.GetDocumentsByMultiMatch(value);

            return Ok(documents);
        }
        
        [HttpGet]
        public async Task<IActionResult> GetDocumentsAnyCaseSensitivity(string value) 
        {
            //Get all documents by match pharse multi field
            List<Document> documents = await _elasticDocumentService.GetDocumentsAnyCaseSensitivity(value);

            return Ok(documents);
        }
        
        [HttpGet]
        public async Task<IActionResult> GetDocumentsAnalyzeWildcard(string value)
        {
            //Get all documents by match pharse multi field
            List<Document> documents = await _elasticDocumentService.GetDocumentsAnalyzeWildcard(value);

            return Ok(documents);
        }
        #endregion
    }
}
