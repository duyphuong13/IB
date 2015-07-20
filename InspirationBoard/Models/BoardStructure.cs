using System.Drawing;

namespace InspirationBoard.Models
{

    public class BoardStructure
    {
        public int height { get; set; }
        public int width { get; set; }
        public string type { get; set; }

        public WWData wwData { get; set; }
        public int imgLeft { get; set; }
        public int imgTop { get; set; }
        public int imgHeight { get; set; }
        public int imgWidth { get; set; }

        public BoardStructure[] children { get; set; }

        public PointF drawPosition { get; set; }
        public Bitmap bitmapImage { get; set; }


    }
    public class WWData
    {
        public string portfolioItemId { get; set; }
        public string vendorName { get; set; }
        public string vendorUrl { get; set; }
        public string img { get; set; }
        public decimal zoom { get; set; }

    }
}