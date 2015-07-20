using InspirationBoard.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InspirationBoard.Controllers
{
    public class InspirationBoardController : Controller
    {
        // GET: InspirationBoard

        private PhuongDbContext _dbContext;
        private PhuongDbContext BoardDbContext
        {
            get
            {
                if (_dbContext == null)
                    _dbContext = new PhuongDbContext();
                return _dbContext;
            }
        }
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult MyBoard()
        {
            return View();
        }
        public ActionResult UpdateBoard(Guid id)
        {
            ViewBag.BoardId = id;
            return View();
        }
        public ActionResult UserViewBoards(Guid id)
        {
            ViewBag.BoardId = id;
            return View();
        }
        public ActionResult CreateNewBoardPartialView()
        {
            return PartialView();
        }
        public ActionResult UpdateBoardPartialView()
        {
            return PartialView();
        }
        public ActionResult Test()
        {
            return View();
        }
        public class GetMyBoardsResponse
        {
            public List<BoardItem> boards { get; set; }
            public int totalItems { get; set; }
            //data.boards, data.totalItems
        }
        [HttpGet]
        public JsonResult GetMyBoards(int pageIndex = 0, int pageSize = 10)
        {
            var boardQuery = BoardDbContext.BoardItems.Where(p => p.UserId == 1)
                                      .OrderByDescending(p => p.Title);
            int totalRows = boardQuery.Count();
            var result = boardQuery.Skip(pageSize * pageIndex).Take(pageSize).ToList();
            foreach (var item in result)
            {
                item.BoardImageUrl = string.Format(@"/cdn/images/{0}?w={1}&h={2}", item.BoardImageUrl, 220, 220);
            }
            GetMyBoardsResponse response = new GetMyBoardsResponse();
            response.boards = result;
            response.totalItems = totalRows;
            return Json(response, JsonRequestBehavior.AllowGet);
        }


        /// <summary>
        /// Get Strip image by type 
        /// </summary>
        /// <param name="type">type = 0 : get all strip image from other , type = 1 : get from my photo </param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetStripImages(int type = 0, int pageIndex = 0, int pageSize = 20)
        {

            IQueryable<PhotoItem> photosQuery = null;
            if (type == 0)
            {

                photosQuery = BoardDbContext.PhotoItems.Where(p => p.IsPublic == true).OrderBy(p => p.CreatedDate);
            }
            else
            {
                photosQuery = BoardDbContext.PhotoItems.Where(p => p.UserId == 1)
                                          .OrderByDescending(p => p.CreatedDate);
            }

            int totalRows = photosQuery.Count();

            var photos = photosQuery.Skip(pageSize * pageIndex).Take(pageSize).ToList();

            ImageStripReturnViewModel result = new ImageStripReturnViewModel();
            result.total_image_count = totalRows;
            result.images = new List<ImageItem>();

            foreach (var item in photos)
            {
                result.images.Add(new ImageItem
                    {
                        image_id = item.Id.ToString(),

                        image_url = string.Format(@"/cdn/images/{0}", item.Url),
                        thumbnail_url = string.Format(@"/cdn/images/{0}?w={1}&h={2}", item.Url, 100, 100),
                        vendor_name = item.UserName,
                        storefront_url = "hahah"
                    });
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveBoardItem(BoardItem boardItem)
        {
            var currentBoardItem = BoardDbContext.BoardItems.FirstOrDefault(b => b.Id == boardItem.Id && b.UserId == 1);
            var isSuccess = false;
            if (currentBoardItem != null)
            {
                currentBoardItem.Title = boardItem.Title;
                currentBoardItem.Description = boardItem.Description;
                currentBoardItem.IsShowProfile = boardItem.IsShowProfile;
                if (currentBoardItem.BoardStructure != boardItem.BoardStructure && !string.IsNullOrWhiteSpace(boardItem.BoardStructure))
                {
                    currentBoardItem.BoardStructure = boardItem.BoardStructure;
                    ImageHelpers.CombineImages(currentBoardItem.BoardStructure, Server.MapPath("~/App_Data/"),
                                            currentBoardItem.Id.ToString());
                    currentBoardItem.BoardImageUrl = currentBoardItem.Id.ToString() + ".PNG";
                }
                isSuccess = BoardDbContext.SaveChanges() > 0;
            }
            return Json(isSuccess);
        }
        [HttpPost]
        public JsonResult AddNewBoardItem(BoardItem boardItem)
        {
            boardItem.BoardStructure = boardItem.BoardStructure;
            //TODO: change to current user
            boardItem.UserId = 1;
            boardItem.BoardImageUrl = "iboard-new-empty.jpg";
            BoardDbContext.BoardItems.Add(boardItem);
            var isSuccess = BoardDbContext.SaveChanges() > 0;
            return Json(isSuccess);
        }


        [HttpPost]
        public JsonResult UpdateBoardItem(BoardItem boardItem)
        {
            var currentBoardItem = BoardDbContext.BoardItems.FirstOrDefault(b => b.Id == boardItem.Id && b.UserId == 1);
            var isSuccess = false;
            if (currentBoardItem != null)
            {
                currentBoardItem.Title = boardItem.Title;
                currentBoardItem.Description = boardItem.Description;
                isSuccess = BoardDbContext.SaveChanges() > 0;
            }
            return Json(isSuccess);
        }
        [HttpPost]
        public JsonResult DeleteBoardItem(BoardItem boardItem)
        {
            var currentBoardItem = BoardDbContext.BoardItems.FirstOrDefault(b => b.Id == boardItem.Id && b.UserId == 1);
            var isSuccess = false;
            if (currentBoardItem != null)
            {
                BoardDbContext.BoardItems.Remove(currentBoardItem);
                isSuccess = BoardDbContext.SaveChanges() > 0;
            }
            return Json(isSuccess);
        }

        [HttpGet]
        public JsonResult GetBoardItem(Guid boardId)
        {
            var result = BoardDbContext.BoardItems.FirstOrDefault(p => p.Id == boardId && p.UserId == 1);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}