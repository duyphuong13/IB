using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InspirationBoard.ViewModels
{
    public class ImageStripReturnViewModel
    {
        public int total_image_count { get; set; }
        public List<ImageItem> images { get; set; }
    }

    public class ImageItem
    {
        public string thumbnail_url { get; set; }
        public string image_url { get; set; }
        public string image_id { get; set; }
        public string vendor_name { get; set; }
        public string storefront_url { get; set; }
    }
  
}