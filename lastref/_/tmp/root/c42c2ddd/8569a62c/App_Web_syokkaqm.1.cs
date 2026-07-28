#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\_kapakyap.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "EBFDF3907FFD2D08C54995F2D685446D34569902"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\_kapakyap.aspx.cs"
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

            int hizmetid = Convert.ToInt32(Request["hizmetid"]);
            string picture = Request["id"].ToString();


            List<String> columns = new List<string>() { "PictureUrl" };
            List<String> values = new List<string>() { picture.ToString() };

            try
            {
                sf.inored("hizmet", "HizmetId", hizmetid, columns, values, true);
                string url = Request.UrlReferrer.GetLeftPart(UriPartial.Path);
                string parameters = Request.UrlReferrer.Query.Replace("?change=true", "").Replace("&change=true", "");
                url += (parameters == "") ? "?change=true" : parameters + "&change=true";
                Response.Redirect(url);
            }
            catch (Exception)
            {

            }

        }
        catch (Exception)
        {
        }
    }
}

#line default
#line hidden
