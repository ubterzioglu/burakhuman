#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\success.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "3579B8711CA33A0BCE63A8D5576B2B09D460D8E0"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\success.aspx.cs"
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

            sf.seo("Success");
            odendi(g);
        }
        catch (Exception er)
        {
			Response.Write(er.Message);
          //  Response.Redirect("default");
        }
    }

    public void odendi(string guid)
    {
        DataTable dt = sf.getdt("siparis", "Where Guid='" + guid+"'");
        int id = Convert.ToInt32(dt.Rows[0]["SiparisId"]);
        int urunid = Convert.ToInt32(dt.Rows[0]["UrunId"]);
        


        string status = (urunid==1)? "2":"1";
        List<string> columns = new List<string> { "Durum" };
        List<string> values = new List<string> { status };

        string x = sf.inored("siparis", "SiparisId", id, columns, values, false);

    }
}

#line default
#line hidden
