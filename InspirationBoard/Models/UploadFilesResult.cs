using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InspirationBoard.Models
{
    public class UploadFilesResult
    {
        public string Name { get; set; }
        public int Length { get; set; }
        public string Type { get; set; }

        public string Url { get; set; }
        public string ThumbnailUrl { get; set; }

        public string deleteType { get { return "DELETEL"; } }
        public string deleteUrl { get; set; }
        public string name { get { return Name; } }
        public int size { get { return Length; } }
        public string thumbnailUrl { get { return ThumbnailUrl; } }
        public string type { get { return Type; } }
        public string url { get { return Url; } }

        //        deleteType: "DELETE"
        //deleteUrl: "http://jquery-file-upload.appspot.com/AMIfv95dQGFNNB8QhQWGxyv4qV1ZDhvWtgYFGFTsIYlfGx0vgmb9B_mLqACpmQlVNegStB6qr4Gk90xdTycSuylUOGAH8XN-A2oBGuzMXFEPIySXfHml2Z-4S8ozZeDnDAAv9Hq1MZaziQM1Zng0HA70gruPn_P2TENn3AmfWninyk16ZIMvFDs/template1-preview.jpg?delete=true"
        //name: "template1-preview.jpg"
        //size: 11594
        //thumbnailUrl: "http://lh6.ggpht.com/LFan3Ugz-LF1kx0h5h3AkvawkInJZ9UO1IkSDtAELZoEjJxiz2m106EVN64J5PuzlK7tBVw-50mGlO1Z84TJSmwppmnwcb0=s80"
        //type: "image/jpeg"
        //url: "http://jquery-file-upload.appspot.com/AMIfv95dQGFNNB8QhQWGxyv4qV1ZDhvWtgYFGFTsIYlfGx0vgmb9B_mLqACpmQlVNegStB6qr4Gk90xdTycSuylUOGAH8XN-A2oBGuzMXFEPIySXfHml2Z-4S8ozZeDnDAAv9Hq1MZaziQM1Zng0HA70gruPn_P2TENn3AmfWninyk16ZIMvFDs/template1-preview.jpg"
    }

}