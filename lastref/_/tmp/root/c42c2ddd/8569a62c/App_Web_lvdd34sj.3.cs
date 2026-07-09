#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\siparisdetay.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "05BB82EF8D401F59F5C7E3339C6E51E2E059D826"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\siparisdetay.aspx.cs"
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_Default2 : System.Web.UI.Page
{
    sayfa sf = new sayfa();
    protected void Page_Load(object sender, EventArgs e)
    {
        int x = 0;

        if (!IsPostBack)
        {
            try
            {
                x = Convert.ToInt32(Request["id"]);
                if (x > 0) siparisdetay(x);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }

    public void siparisdetay(int x)
    {
        DataTable siparis = sf.getdt("siparis", "Where SiparisId=" + x);
        rptSiparisDetay.DataSource = siparis;
        rptSiparisDetay.DataBind();
    }

    public string geturunisim(object o)
    {
        int id = Convert.ToInt32(o.ToString());
        string[] dizi = new string[] { "", "E - Book (readable)", "E - Book (audio)", "Basılı Kitap" };
        return dizi[id];
    }

    public string htmluret(object o)
    {

        string metin = (o == null) ? "" : o.ToString();
        return sf.htmluret(metin);
    }



    protected void btnGonder_Click(object sender, EventArgs e)
    {

        int id = Convert.ToInt32(Request["id"]);

        string aciklama = txtIcerik.Text;

        List<String> columns = new List<string>() { "Aciklama" };
        List<String> values = new List<string>() { aciklama };
        sf.inored("siparis", "SiparisId", id, columns, values, false, false);
    }


}

#line default
#line hidden
