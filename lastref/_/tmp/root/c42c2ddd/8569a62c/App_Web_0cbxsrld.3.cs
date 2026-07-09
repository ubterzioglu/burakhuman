#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\books.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "4EBD44F2868DC5DD2013055A3FCBEEF48BA9AFFA"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\books.aspx.cs"
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
        sf.seo("Books");
    }

}

#line default
#line hidden
