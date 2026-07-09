#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\Default.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "0EB236A6920A3549986C1C1741FD431D1F63EBCC"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\Default.aspx.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    sayfa sf = new sayfa();
    public string lang = "en";
    protected void Page_Load(object sender, EventArgs e)
    {
        slider();
        blogs();
        sf.seo();
    }

    public void slider()
    {
        rptSlider.DataSource = sf.getdt("pages", "Where TypeID=3 AND lang='" + lang + "' order by pages.rank limit 4");
        rptSlider.DataBind();

        rptKurumsal.DataSource = sf.getdt("pages", "Where PageId=7");
        rptKurumsal.DataBind();
    }

    public void blogs()
    {
        rptBlogCategories.DataSource = sf.getdt("categories", "Where TypeId=2");
        rptBlogCategories.DataBind();
        rptBlogs.DataSource = sf.getdt("pages", "Where TypeId=2 AND lang='" + lang + "' order by pages.rank limit 8");
        rptBlogs.DataBind();
    }

    public string htmluret(object o)
    {
        return o.ToString();
    }
}

#line default
#line hidden
