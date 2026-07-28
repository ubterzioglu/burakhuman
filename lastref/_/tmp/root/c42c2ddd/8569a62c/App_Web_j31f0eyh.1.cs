#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\failed.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "FFCEAD8376D3AC747BC22B10DE5D4391231532EA"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\failed.aspx.cs"
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Default2 : System.Web.UI.Page
{
    public int urunid = 1;
    sayfa sf = new sayfa();
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            string g = sf.fix(Request["g"].ToString());

            sf.seo("Failed");
            sil(g);
        }
        catch (Exception)
        {
            Response.Redirect("default");
        }
    }

    public void sil(string guid)
    {


        DataTable dt = sf.getdt("siparis", "Where Guid='" + guid + "'");
        int id = Convert.ToInt32(dt.Rows[0]["SiparisId"]);

        sf.delete("siparis", "SiparisId", id.ToString());

    }
}

#line default
#line hidden
