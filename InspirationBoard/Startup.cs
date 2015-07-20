using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(InspirationBoard.Startup))]
namespace InspirationBoard
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
