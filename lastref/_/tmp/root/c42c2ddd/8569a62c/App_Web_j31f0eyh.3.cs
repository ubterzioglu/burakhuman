#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\blogs.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "29A14803DF0A778090E55CEE8F48E19FE5225DF6"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\blogs.aspx.cs"
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
        blogs();
        sf.seo("Blog");
    }


    public void blogs()
    {
        rptBlogCategories.DataSource = sf.getdt("categories", "Where TypeId=2");
        rptBlogCategories.DataBind();
        rptBlogs.DataSource = sf.getdt("pages", "Where TypeId=2 AND lang='" + lang + "' order by pages.rank");
        rptBlogs.DataBind();
    }

    public string htmluret(object o)
    {
        return o.ToString();
    }
}

#line default
#line hidden
