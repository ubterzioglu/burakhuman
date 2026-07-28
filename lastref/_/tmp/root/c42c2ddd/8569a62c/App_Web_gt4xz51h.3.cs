#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\files.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "DDF848CDF31FF6BA2CA40B40D05C3FF6C892D624"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\files.aspx.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_Default2 : System.Web.UI.Page
{
    sayfa sf = new sayfa();
    protected void Page_Load(object sender, EventArgs e)
    {

        try
        {
            int x = Convert.ToInt32(Request["id"]);
            string tur = (Request["tur"] == "file") ? "file" : "image";
            rptAlbum.DataSource = sf.getdt("files", "Where AlbumId="+x+" and Tur='"+tur+"' Order by rank");
            rptAlbum.DataBind();
        }
        catch (Exception)
        {
      //      Response.Redirect("default.aspx");
        }
    }

    public string icon(object o,object p,object s)
    {
        string ret = "";
        string picurl = o.ToString();
        string tur = p.ToString();
        string ext = s.ToString();
        if (tur == "image")
        {
            return "../Dosyalar/orta/" + picurl;
        }

        else
        {
            return "img/icons/" + ext + ".png";
        }
    }
}

#line default
#line hidden
