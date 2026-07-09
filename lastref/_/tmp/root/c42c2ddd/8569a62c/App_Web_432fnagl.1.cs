#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\hesap.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "850D167196EF4E82B2B7388881ED47F476D9E672"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\hesap.aspx.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;

public partial class Admin_Default2 : System.Web.UI.Page
{
    sayfa sf = new sayfa();
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            int id = Convert.ToInt32(Request["id"]);
            if (id > 0 && !IsPostBack) Goster(id);
        }
        catch (Exception)
        {
            
            throw;
        }
    }

    public void Goster(int id){
        DataTable dt = sf.getdt("hesaplar", "Where HesapId=" + id);
        txtBankaAd.Text = dt.Rows[0]["BankaAd"].ToString();
        txtHesapAd.Text = dt.Rows[0]["HesapAd"].ToString();
        txtSubeKod.Text = dt.Rows[0]["SubeKod"].ToString();
        txtSube.Text = dt.Rows[0]["SubeAd"].ToString();
        txtHesapNo.Text = dt.Rows[0]["HesapNo"].ToString();
        txtIbanNo.Text = dt.Rows[0]["IbanNo"].ToString();

    }
    protected void btnGonder_Click(object sender, EventArgs e)
    {
        int id = Convert.ToInt32(Request["id"]);
        string bankaad = sf.fix(txtBankaAd.Text);
        string hesapad = sf.fix(txtHesapAd.Text);
        string subead = sf.fix(txtSube.Text);
        string subekod = sf.fix(txtSubeKod.Text);
        string hesapno = sf.fix(txtHesapNo.Text);
        string ibanno = sf.fix(txtIbanNo.Text);
        if (bankaad == "" || hesapad == "" || subead == "" || hesapno == "" || ibanno == "")
        {
            pnlAlert.Visible = true;
            lblHata.Text = "Lütfen boş alan bırakmayınız.";
        }

        else
        {
            
            List<String> columns = new List<string>() { "BankaAd","HesapAd","SubeAd","SubeKod", "HesapNo","IbanNo" };
            List<String> values = new List<string>() { bankaad,hesapad,subead,subekod,hesapno,ibanno };

            sf.inored("hesaplar", "HesapId", id, columns, values, true);
            Response.Redirect("hesaplar.aspx?added=true");

        }
    }
}

#line default
#line hidden
