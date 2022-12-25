using Nest;
using WebApi.Models.ElasticSearch;

namespace WebApi.Mapping
{
    public static class Mapping
    {
        public static CreateIndexDescriptor DocumentMapping(this CreateIndexDescriptor discriptor)
        {
            return discriptor.Map<Document>(m => m.Properties(p => p
                .Keyword(k => k.Name(n => n.Uid))
                .Text(t => t.Name(n => n.Title))
                .Text(t => t.Name(n => n.Content))
                .Text(t => t.Name(n => n.Filepath))
            ));
        }
    }
}
