using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InspirationBoard
{
    [Table("IB_Board")]
    public class BoardItem
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string BoardStructure { get; set; }
        public bool IsShowProfile { get; set; }
        public string BoardImageUrl { get; set; }
        public int UserId { get; set; }

    }

    //public class ImageGallery
    //{
    //    public ImageGallery()
    //    {
    //        ImageList = new List<string>();
    //    }
    //    //[Key]
    //    public Guid ID { get; set; }
    //    public string Name { get; set; }
    //    public string ImagePath { get; set; }
    //    public List<string> ImageList { get; set; }
    //}

    [Table("IB_Photo")]
    public class PhotoItem
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public string Url { get; set; }
        public string ThumbUrl { get; set; }
        public string Tag { get; set; }
        public DateTime CreatedDate { get; set; }
        public int UserId { get; set; }

        // 
        public string UserName { get; set; }

        //using for that image will show in Image Galary. 
        public bool IsPublic { get; set; }

    }
    [Table("IB_PhotoCategory")]
    public class PhotoCategory
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string CategoryName { get; set; }
    }
}
