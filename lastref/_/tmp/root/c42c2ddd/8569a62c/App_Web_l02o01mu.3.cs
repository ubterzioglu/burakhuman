#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\mesaj.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "E9D798E827C76FC6E2A13C142669A4F15D5C3F57"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\mesaj.aspx.cs"
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
        if (Request["deleted"] != null)
        {
            Response.Redirect("mesajlar?deleted=true");
        }

        try
        {
            
            int x = Convert.ToInt32(Request["id"].ToString());
            getir(x);
        }
        catch (Exception)
        {
            Response.Redirect("default");
        }
    }

    public void getir(int id)
    {
        rptMesaj.DataSource = sf.getdt("messages", "Where MessageId=" + id);
        rptMesaj.DataBind();
    }
}

#line default
#line hidden
