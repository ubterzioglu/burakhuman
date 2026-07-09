#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\MasterPage.master.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "07F476FFEB7A71BF27D4583600603F7FCC951A26"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\MasterPage.master.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class MasterPage : System.Web.UI.MasterPage
{
    sayfa sf = new sayfa();
    public string _username = "";
    protected void Page_Load(object sender, EventArgs e)
    {
        if (sf.islogin() > 0)
        {
            pnlUser.Visible = true;
            _username = sf.getuserdetail("UyeAd");
            pnlGuest.Visible = false;
        }
        else
        {
            pnlUser.Visible = false;
            pnlGuest.Visible = true;
        }

        if (!IsPostBack)
        {
           
        }
    }
}


#line default
#line hidden
