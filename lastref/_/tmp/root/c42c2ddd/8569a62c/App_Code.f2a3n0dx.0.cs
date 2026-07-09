#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\App_Code\paypal.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "5DEA9FBD349AF2E295251A67AACC99F25CAE3E25"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\App_Code\paypal.cs"
using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Text;

public class PaypalOdeme
{

    public static string AccountEmail = "info@humanconsciousnessdecoded.com";

    public static string PayPalUrl = "https://www.sandbox.paypal.com/us/cgi-bin/webscr?";

    private static string PayPalBaseUrl = "https://www.paypal.com/cgi-bin/webscr?";

    private static string ImageUrl = "resimadresin";

    private static string SuccessUrl = "http://humanconsciousnessdecoded.com/success";

    private static string CancelUrl = "http://humanconsciousnessdecoded.com/failed";

    

    public static string Adres(decimal Amount, string ItemName, string SiparisID,string ItemNumber)
    {
		SuccessUrl = "http://humanconsciousnessdecoded.com/success";
        SuccessUrl += "?g=" + SiparisID;
        //Amerikada "." kullanıldığı için "," ile replace ediyoruz

        string tutar = Convert.ToString(Amount).Replace(',', '.');

        StringBuilder Url = new StringBuilder();

        //HttpUtility.UrlEncode(AccountEmail)

        Url.Append(PayPalBaseUrl + "cmd=_xclick&undefined_quantity=0&no_shipping=1&no_note=1&currency_code=USD&add=0");

        Url.AppendFormat("&business={0}", HttpUtility.UrlEncode(AccountEmail));

        Url.AppendFormat("&item_name={0}", HttpUtility.UrlEncode(ItemName));

        Url.AppendFormat("&item_number={0}", HttpUtility.UrlEncode(ItemNumber));

        Url.AppendFormat("&image_url={0}", HttpUtility.UrlEncode(ImageUrl));

        Url.AppendFormat("&amount={0:f2}", tutar);

        Url.AppendFormat("&return={0}", HttpUtility.UrlEncode(SuccessUrl));

        Url.AppendFormat("&cancel_return={0}", HttpUtility.UrlEncode(CancelUrl));

        return Url.ToString();

    }

}

#line default
#line hidden
