#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\medya.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "60614621A2694428FB637DE41F11ECAC3BAACCC0"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\medya.aspx.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_Default2 : System.Web.UI.Page
{
    sayfa sf = new sayfa();
    public string _baseurl = "";
    protected void Page_Load(object sender, EventArgs e)
    {
   //     _baseurl = Request.Url.GetLeftPart(UriPartial.Authority);

        rptAlbum.DataSource = sf.getdt("files", "Where AlbumId=0 and Tur='image'");
        rptAlbum.DataBind();
    }
}

#line default
#line hidden
