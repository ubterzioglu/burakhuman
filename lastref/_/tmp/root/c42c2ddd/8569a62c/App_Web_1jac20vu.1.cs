#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\file.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "C086AC5415068D16F4A35AE4C24ED9E696A7FC6B"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\file.aspx.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

public partial class Admin_Default2 : System.Web.UI.Page
{

    sayfa sf = new sayfa();
    public string _name = "Görsel";
    string tur = "";
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            int albumid = Convert.ToInt32(Request["id"]);
            tur = Request["tur"];
            if (tur != "image" && tur != "file") Response.Redirect("default.aspx");
            if (tur == "file") _name = "Dosya";
        }
        catch (Exception)
        {
            Response.Redirect("default.aspx");
        }
    }
    protected void btnGonder_Click(object sender, EventArgs e)
    {

        pnlSuccess.Visible = false;
        int albumid = Convert.ToInt32(Request["id"]);





        int x = sf.counttable("pages", "Where PageId=" + albumid);
        if (albumid == 0) x = 1;
        if (x > 0)
        {
            for (int i = 0; i < Request.Files.Count; i++)
            {
                HttpPostedFile file = Request.Files[i];

                string baslik = sf.fix(file.FileName);
                string isim = "";
                string ext = "";


                if (tur == "image")
                {
                    try
                    {
                        ext = Path.GetExtension(file.FileName).Substring(1);
                        string node = Guid.NewGuid().ToString().Replace("-", "");
                        isim = node + "." + ext;
                        if (ext != "jpg" && ext != "png" && ext != "JPG" && ext != "jpeg" && ext != "JPEG" && ext != "PNG" && ext!= "gif")
                        {
                            pnlAlert.Visible = true;
                            lblHata.Text += file.FileName + " adlı dosyanın formatı uygun değil. Lütfen jpg ya da png yükleyiniz. </br>";
                        }
                        else
                        {
                            lblSuccess.Text += file.FileName + " adlı dosya başarıyla eklendi.</br>";


                            List<String> columns = new List<string>() { "AlbumId", "Tur", "Ext", "FileTitle", "FileUrl" };
                            List<String> values = new List<string>() { albumid.ToString(), tur.ToString(), ext, baslik, isim };
                            sf.orjinalkayitpf(isim, file);

                            sf.inored("files", "FileId", 0, columns, values,true,true);
                        }
                    }
                    catch (Exception)
                    {

                    }

                }

                else if (tur == "file")
                {
                    try
                    {
                        ext = Path.GetExtension(file.FileName).Substring(1);
                        string node = Guid.NewGuid().ToString().Replace("-", "");
                        isim = node + "." + ext;
                        if (ext.ToLower() != "rar" && ext.ToLower() != "zip" && ext.ToLower() != "pdf" && ext.ToLower() != "doc" && ext.ToLower() != "docx" && ext.ToLower() != "xls" && ext.ToLower() != "xlsx" && ext.ToLower() != "ppt" && ext.ToLower() != "pptx" && ext.ToLower() != "pps")
                        {
                            pnlAlert.Visible = true;
                            lblHata.Text += file.FileName + " adlı dosyanın formatı uygun değil. Lütfen zip-rar şeklinde veya office dökümanı şeklinde yükleyiniz. </br>";
                        }
                        else
                        {
                            lblSuccess.Text += file.FileName + " adlı dosya başarıyla eklendi.</br>";

                            List<String> columns = new List<string>() { "AlbumId", "Tur", "Ext", "FileTitle", "FileUrl" };
                            List<String> values = new List<string>() { albumid.ToString(), tur.ToString(), ext, baslik, isim };
                            sf.orjinalkaydet(isim, file);
                            sf.inored("files", "FileId", 0, columns, values, true,true);
                        }
                    }
                    catch (Exception)
                    {

                    }
                }


            }

            try
            {
                if (lblHata.Text.Length == 0) // hata yoksa
                {
                    if (albumid == 0) Response.Redirect("medya"); // medya ise medyaya git
                    Response.Redirect("files.aspx?tur=" + tur + "&id=" + albumid);
                    if (lblSuccess.Text.Length != 0) pnlSuccess.Visible = true;
                }

                else
                {
                    pnlAlert.Visible = true;
                    if (lblSuccess.Text.Length != 0) pnlSuccess.Visible = true;
                }
            }
            catch (Exception)
            {

            }

        }
        else
        {
            pnlAlert.Visible = true;
            lblHata.Text = "İçerik bulunamadı.";
        }

    }
}


#line default
#line hidden
