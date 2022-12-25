using DocumentFormat.OpenXml.Office2013.Word;
using Microsoft.Extensions.Configuration;
using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Mapping;
using WebApi.Models.ElasticSearch;

namespace WebApi.Services.ElasticSearch
{
    public interface IElasticDocumentService
    {
        Task CheckIndex(string indexName);
        Task DeleteIndex(string indexName);
        Task InsertDocument(string indexName, Document document);
        Task DeleteByIdDocument(string indexName, Document document);
        Task InsertBulkDocuments(string indexname, Document[] document);
        Task<Document> GetDocumentById(string indexName, string id);
        Task<List<Document>> WildcardGetDocuments(string value);
        Task<List<Document>> GetDocumentsByFuzzyWord(string value);
        Task<List<Document>> GetDocumentsByMatchPrefix(string value);
        Task<List<Document>> GetDocumentsByMultiMatch(string value);
        Task<List<Document>> GetDocumentsAnyCaseSensitivity(string value);
        Task<List<Document>> GetDocumentsAnalyzeWildcard(string value);
    }

    public class DocumentService : IElasticDocumentService
    {
        private readonly IConfiguration _configuration;
        private readonly IElasticClient _client;
        public DocumentService(IConfiguration configuration)
        {
            _configuration = configuration;
            _client = CreateInstance();
        }
        private ElasticClient CreateInstance()
        {
            string host = _configuration.GetSection("ElasticsearchServer:Host").Value;
            string port = _configuration.GetSection("ElasticsearchServer:Port").Value;
            string username = _configuration.GetSection("ElasticsearchServer:Username").Value;
            string password = _configuration.GetSection("ElasticsearchServer:Password").Value;
            var settings = new ConnectionSettings(new Uri(host + ":" + port));
            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
                settings.BasicAuthentication(username, password);

            return new ElasticClient(settings);
        }

        public async Task CheckIndex(string indexName)
        {
            var anyy = await _client.Indices.ExistsAsync(indexName);
            if (anyy.Exists)
                return;

            var response = await _client.Indices.CreateAsync(indexName,
                ci => ci
                    .Index(indexName)
                    .DocumentMapping()
                    .Settings(s => s.NumberOfShards(3).NumberOfReplicas(1))
                    );

            return;
        }

        public async Task DeleteIndex(string indexName)
        {
            await _client.Indices.DeleteAsync(indexName);
        }

        public async Task<Document> GetDocumentById(string indexName, string id)
        {
            var response = await _client.GetAsync<Document>(id, q => q.Index(indexName));
            return response.Source;
        }

        public async Task InsertDocument(string indexName, Document document) // Something wrong, fix it later
        {
            var response = await _client.CreateAsync(document, q => q.Index(indexName));

            if (response.ApiCall?.HttpStatusCode == 409)
            {
                await _client.UpdateAsync<Document>(document.Uid, a => a.Index(indexName).Doc(document));
            }
        }

        public async Task InsertBulkDocuments(string indexName, Document[] document) //Insert many documents
        {
            await _client.BulkAsync(b => b.Index(indexName).IndexMany(document));
        }

        public async Task DeleteByIdDocument(string indexName, Document document)
        {
            var response = await _client.CreateAsync(document, q => q.Index(indexName));
            if (response.ApiCall?.HttpStatusCode == 409)
            {
                await _client.DeleteAsync(DocumentPath<Document>.Id(document.Uid).Index(indexName));
            }
        }

        public void Insert(Document doc, string indexName)
        {
            _client.Index(doc, i => i
                  .Id(doc.Uid)
                  .Index(indexName)
                  );
        }



        #region          ------------------  GET data in index:documents  ---------------------
        public async Task<List<Document>> WildcardGetDocuments(string value) // Tìm kiếm từ không rõ ràng (VD: nguy*n, vă*)
        {
            //Wildcard completes the letter itself        
            var response = await _client.SearchAsync<Document>(s => s
                    .From(0)
                    .Take(10) // Take 10 result start from 0
                    .Index("documents")
                    .Query(q => q
                    .Bool(b => b
                    .Should(m => m
                    .Wildcard(w => w
                    .Field("content")
                    .Value(value))))));

            return response.Documents.ToList();
        }

        public async Task<List<Document>> GetDocumentsByFuzzyWord(string value) //Tìm kiếm từ bị thay đổi vị trí kí tự (VD: mihn, gnuyễn)
        {

            //Fuzzy word can be in parametric self-complements
            //var response = await _client.SearchAsync<Document>(s => s
            //                .Index("documents")
            //                .Query(q => q
            //                .Fuzzy(fz => fz.Field("content")
            //                .Value(value).Fuzziness(Fuzziness.EditDistance(4))
            //        )
            //    ));

            //swapping letters (Thay đổi vị trí kí tự)
            var response = await _client.SearchAsync<Document>(s => s
                            .Index("documents")
                            .Query(q => q
                            .Fuzzy(fz => fz.Field("content")
                            .Value(value).Transpositions(true))
                    ));

            return response.Documents.ToList();
        }

        public async Task<List<Document>> GetDocumentsByMatchPrefix(string value) // Tìm kiếm theo một số kí tự đầu của từ (VD: ng )
        {
            //MatchPhrasePrefix completes the letter itself.It is higher in performance than Wildcard.
            var response = await _client.SearchAsync<Document>(s => s
                                .Index("documents")
                                .Query(q => q.MatchPhrasePrefix(m => m.Field(f => f.Content).Query(value).MaxExpansions(10)))
                               );

            response = await _client.SearchAsync<Document>(s => s
                            .Index("documents")
                            .Query(q => q
                            .MultiMatch(mm => mm
                            .Fields(f => f
                            .Field(ff => ff.Title)
                            .Field(ff => ff.Content))
                    .Type(TextQueryType.PhrasePrefix)
                    .Query(value)
                    .MaxExpansions(10)
                )));

            return response.Documents.ToList();
        }

        public async Task<List<Document>> GetDocumentsByMultiMatch(string value) // Tìm kiếm theo nhiều field với PhrasePrefix
        {
            //MatchPhrasePrefix completes the letter itself.It is higher in performance than Wildcard.
            var response = await _client.SearchAsync<Document>(s => s
                            .Index("documents")
                            .Query(q => q
                            .MultiMatch(mm => mm
                            .Fields(f => f
                            .Field(ff => ff.Title)
                            .Field(ff => ff.Content))
                    .Type(TextQueryType.PhrasePrefix)
                    .Query(value)
                    .MaxExpansions(10)
                )));

            return response.Documents.ToList();
        }

        public async Task<List<Document>> GetDocumentsTerm(string value) // Giá trị tìm kiến phải là chữ thường
        {
            //Term here must be all lowercase
            var response = await _client.SearchAsync<Document>(s => s
                                .Index("documents")
                                .Size(10000)
                                .Query(query => query.Term(f => f.Content, value))
                               );
            return response.Documents.ToList();
        }

        public async Task<List<Document>> GetDocumentsAnyCaseSensitivity(string value) //Giá trị tìm kiếm hông phân biệt chữ hoa, thường
        {
            // Match does not have case sensitivity
            var response = await _client.SearchAsync<Document>(s => s
                                    .Index("documents")
                                    .Size(10000)
                                    .Query(q => q
                                    .Match(m => m.Field("content").Query(value)
                                 )));

            return response.Documents.ToList();
        }

        public async Task<List<Document>> GetDocumentsAnalyzeWildcard(string value) // Tìm kiếm kí tự nằm giữa từ
        {
            // It works on AnalyzeWildcard like query logic.
            var response = await _client.SearchAsync<Document>(s => s
                                    .Index("documents")
                                    .Query(q => q
                                    .QueryString(qs => qs
                                    .AnalyzeWildcard()
                                    .Query("*" + value + "*")
                                    .Fields(fs => fs
                                    .Fields(f1 => f1.Content)))));

            return response.Documents.ToList();
        }

        #endregion
    }
}
