#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\icerik.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "73644AAB23C546B52BA7F97BC2843450CA3D9491"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\icerik.aspx.cs"
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
    public string _pictureurl = "", _baslik = "",_video="";

    protected void Page_Load(object sender, EventArgs e)
    {


        try
        {
            int id = Convert.ToInt32(Request["id"]);
            icerik(id);
        }
        catch (Exception er)
        {
            Response.Redirect("default.aspx");
        }
    }

    public void icerik(int id)
    {
        int cnt = sf.counttable("pages", "Where PageId=" + id);
        if (cnt > 0)
        {
            DataTable dt = sf.getdt("pages", "Where PageId=" + id);
            _baslik = dt.Rows[0]["PageTitle"].ToString();
            ltlIcerik.Text = dt.Rows[0]["PageText"].ToString();
            _pictureurl = dt.Rows[0]["PictureUrl"].ToString();
            _video = dt.Rows[0]["Val1"].ToString();

            sf.seo(_baslik);

            altfotograflar(id);
        }
        else
            Response.Redirect("default.aspx");

    }

    public void altfotograflar(int id)
    {
        DataTable dt = sf.getdt("files", "Where AlbumId=" + id + " AND tur='image' order by files.rank");
        if (dt.Rows.Count == 0) pnlGorseller.Visible = false;
        else
        {
            rptAltGorseller.DataSource = dt;
            rptAltGorseller.DataBind();
        }
    }


}

#line default
#line hidden
