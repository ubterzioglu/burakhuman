#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\product1.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "6659C8C0F7951212921CCFE56796F96A247A23BE"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\product1.aspx.cs"
using System;
using System.Collections.Generic;
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

        sf.seo("HCD E-Book");
        if (sf.islogin() > 0)
        {
            pnlGuest.Visible = false;
            getDetail();

        }
        else
        {
            pnlUserYetkisiz.Visible = false;
            pnlUserYetkili.Visible = false;
            pnlGuest.Visible = true;
        }
    }


    public void getDetail()
    {
        bool satinalmismi = (sf.counttable("siparis", "Where UrunId=" + urunid + " AND Durum=2 AND UyeId=" + sf.islogin()) > 0) ? true : false;

        if (satinalmismi)
        {
            pnlUserYetkili.Visible = true;
            pnlUserYetkisiz.Visible = false;
        }
        else
        {

            pnlUserYetkili.Visible = false;
            pnlUserYetkisiz.Visible = true;
        }
    }
    protected void btnPurchase_Click(object sender, EventArgs e)
    {

        Decimal tutar = 09.89m;
        string tutars = "09.99";


        string purchasekey = Guid.NewGuid().ToString().Replace("-", string.Empty);
        List<string> columns = new List<string> { "Guid", "UrunId", "UyeId", "AliciAd", "Fiyat", "Durum" };
        List<string> values = new List<string> { purchasekey, urunid.ToString(), sf.islogin().ToString(), sf.getuserdetail("UyeAd"), tutars, "0" };


        sf.inored("siparis","SiparisId",0,columns,values,false,true);



        Response.Redirect(PaypalOdeme.Adres(tutar, "E-Book", purchasekey,"HDC09001"));
        
    }
}

#line default
#line hidden
