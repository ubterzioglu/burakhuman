#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\profile.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "92C249141DCBD7BB4A278C1D1AE500807AD68BD7"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\profile.aspx.cs"
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Default2 : System.Web.UI.Page
{
    sayfa sf = new sayfa();
    protected void Page_Load(object sender, EventArgs e)
    {
        if (sf.islogin() == 0) Response.Redirect("login.aspx");
        else
        {
            getOrders();
            sf.seo("Profile");
        }
    }

    public void getOrders()
    {
        DataTable dt = sf.getdt("siparis", "Where UyeId=" + sf.islogin() +" AND Durum<>0");
        rptOrderHistory.DataSource = dt;
        rptOrderHistory.DataBind();
    }

    public string getStatus(object o, object p)
    {
        if (o.ToString() == "1") return "<a href='product1'>Click the list of e-book formats, and download.</a>";
        else return p.ToString();

    }
}

#line default
#line hidden
