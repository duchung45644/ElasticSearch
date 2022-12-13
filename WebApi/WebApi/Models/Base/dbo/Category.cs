namespace WebApi.Models
{
    public class Category
    {
        public System.Int32 CategoryId { get; set; }
        public System.String Code { get; set; }
        public System.String Name { get; set; }
        public System.Int32? ParentId { get; set; }

        public System.String CateName { get; set; }
        public System.String Value { get; set; }

        public System.Int32? Order { get; set; }


        public System.Int32? UnitId { get; set; }
        public System.Boolean ReadOnly { get; set; }

        public System.Int32 CreatedUserId { get; set; }
        public System.Int32 ModifiedUserId { get; set; }

        public System.DateTime CreatedDate { get; set; }
        public System.DateTime ModifiedDate { get; set; }
    }

}
