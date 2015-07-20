using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace InspirationBoard
{
    public class PhuongDbContext : DbContext
    {
        public PhuongDbContext()
        {
            this.Configuration.LazyLoadingEnabled = false;
        }
        public DbSet<PhotoItem> PhotoItems { get; set; }
        public DbSet<BoardItem> BoardItems { get; set; }
        public DbSet<PhotoCategory> PhotoCategories { get; set; }
        
    }
}