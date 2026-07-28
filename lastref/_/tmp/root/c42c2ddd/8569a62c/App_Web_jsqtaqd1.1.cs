#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\_siparisonayla.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "C0E6D108AF76FCD63787F8CF3619B5F2B5EE7B05"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\_siparisonayla.aspx.cs"
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
            int id = Convert.ToInt32(Request["id"]);
            string status = (Request["onay"] == "true") ? "2" : "1";
            List<string> columns = new List<string> { "Durum" };
            List<string> values = new List<string> { status };

            string x = sf.inored("siparis", "SiparisId", id, columns, values, false);
        }
        catch (Exception)
        {

        }


        if (Request.UrlReferrer != null)
        {
            string url = Request.UrlReferrer.GetLeftPart(UriPartial.Path);
            string parameters = Request.UrlReferrer.Query.Replace("?onay=true", "").Replace("&onay=true", "");
            url += (parameters == "") ? "?onay=true" : parameters + "&onay=true";
            Response.Write(url);
            Response.Redirect(url);
        }

    }
}

#line default
#line hidden
