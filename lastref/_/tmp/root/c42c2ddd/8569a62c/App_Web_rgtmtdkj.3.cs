#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\_sil.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "3CAE747770C3F41252D0116757DD7BDAC3CF7BAD"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\_sil.aspx.cs"
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
        string t = Request["t"];
        string id = Request["id"];
        string prm="";
        string table="";
        if(t=="sayfa"){
            prm  = "PageId";
            table= "pages";
        }

        else if (t == "cat")
        {
            prm = "CatId";
            table = "categories";
        }

        else if (t == "file")
        {
            prm = "FileId";
            table = "files";
        }
        else if (t == "hesap")
        {
            prm = "HesapId";
            table = "hesaplar";
        }

        else if (t == "type")
        {
            prm = "TypeId";
            table = "type";
        }

        else if (t == "siparis")
        {
            prm = "SiparisId";
            table = "siparis";
        }

        try
        {
            sf.delete(table, prm, id);
        }
        catch (Exception er)
        {
           
        }

        if (Request.UrlReferrer != null)
        {
            string url = Request.UrlReferrer.GetLeftPart(UriPartial.Path);
            string parameters = Request.UrlReferrer.Query.Replace("?deleted=true","").Replace("&deleted=true","");
            url += (parameters == "") ? "?deleted=true" : parameters + "&deleted=true";
            Response.Redirect(url);
        }
       
    }
}

#line default
#line hidden
