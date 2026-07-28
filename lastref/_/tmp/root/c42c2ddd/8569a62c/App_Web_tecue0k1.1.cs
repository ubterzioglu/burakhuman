#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\admin.master.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "F20880DDFDDFFD7D2578783C42ECC32FCD0DBA67"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\admin.master.cs"
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_admin : System.Web.UI.MasterPage
{
    sayfa sf = new sayfa();
    protected void Page_Load(object sender, EventArgs e)
    {

        string returnurl = Request.Url.ToString();
        string siteurl = Request.Url.GetLeftPart(UriPartial.Authority);
        returnurl = returnurl.Replace(siteurl, string.Empty);
        if (sf.GetAdminId() == 0) Response.Redirect("login?return=" + returnurl);

        if (Request.UrlReferrer != null)
        {
            string previouspage = Request.UrlReferrer.ToString().Replace(Request.Url.GetLeftPart(UriPartial.Authority), string.Empty);
        }

        Turler();
        mesajsay();
        //int cx = sf.counttable("siparis", "Where Durum=0");
        //if (cx > 0)
        //    lblYeniSiparisler.Text = sf.counttable("siparis", "Where Durum=0").ToString();
        //else lblYeniSiparisler.Visible = false;
    }


    public void mesajsay()
    {
        lblMesaSay.Text = sf.counttable("messages", "Where Status='0'").ToString();
    }


    public void Turler()
    {
        DataTable dt = sf.getdt("type", "");
        rptTypes.DataSource = dt;
        rptTypes.DataBind();
    }

    public string htmluret(object o)
    {
        return sf.htmluret(o.ToString());
    }
}


#line default
#line hidden
