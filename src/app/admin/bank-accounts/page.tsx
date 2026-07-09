import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { deleteBankAccount, saveBankAccount, saveProduct, uploadProductAsset } from "@/lib/member-actions";
import { getBankAccounts, getProductAssets, getProductBySlug } from "@/lib/data";
import { isSupabaseServiceConfigured } from "@/lib/supabase";

type Props = {
  searchParams: Promise<{ edit?: string }>;
};

const assetKinds = ["epub", "mobi", "pdf", "cover"] as const;

export default async function AdminBankAccountsPage({ searchParams }: Props) {
  const params = await searchParams;
  const [accounts, product] = await Promise.all([getBankAccounts(), getProductBySlug("hcd-ebook")]);
  const assets = product ? await getProductAssets(product.id) : [];
  const editing = accounts.find((account) => String(account.id) === params.edit);

  return (
    <AdminShell>
      {product ? (
        <div className="admin-card">
          <h1>Urun</h1>
          <form className="admin-form" action={saveProduct}>
            <input type="hidden" name="id" value={product.id} />
            <label className="wide">
              Baslik
              <input className="input" name="title" defaultValue={product.title} required />
            </label>
            <label>
              Fiyat (cent)
              <input className="input" type="number" name="price_cents" defaultValue={product.price_cents} />
            </label>
            <label>
              <span>Aktif</span>
              <input type="checkbox" name="active" defaultChecked={product.active} />
            </label>
            <div className="wide">
              <button className="button" type="submit">
                Kaydet
              </button>
            </div>
          </form>

          <h2 style={{ marginTop: 18 }}>E-kitap dosyalari (korumali)</h2>
          {!isSupabaseServiceConfigured() ? (
            <div className="admin-warning">Korumali dosya yuklemesi Supabase Storage gerektirir.</div>
          ) : (
            <div className="form-grid">
              {assetKinds.map((kind) => {
                const existing = assets.find((asset) => asset.kind === kind);
                return (
                  <form key={kind} action={uploadProductAsset} style={{ marginBottom: 8 }}>
                    <input type="hidden" name="product_id" value={product.id} />
                    <input type="hidden" name="kind" value={kind} />
                    <label>
                      {kind.toUpperCase()} {existing ? `(mevcut: ${existing.filename})` : "(yok)"}
                      <input className="input" type="file" name="file" required />
                    </label>
                    <button className="button" type="submit">
                      Yukle
                    </button>
                  </form>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      <div className="admin-card" style={{ marginTop: 18 }}>
        <h1>Banka Hesaplari</h1>
        <form className="admin-form" action={saveBankAccount}>
          <input type="hidden" name="id" value={editing?.id ?? ""} />
          <label>
            Banka adi
            <input className="input" name="bank_name" defaultValue={editing?.bank_name ?? ""} required />
          </label>
          <label>
            Hesap adi
            <input className="input" name="account_name" defaultValue={editing?.account_name ?? ""} required />
          </label>
          <label>
            Sube adi
            <input className="input" name="branch_name" defaultValue={editing?.branch_name ?? ""} />
          </label>
          <label>
            Sube kodu
            <input className="input" name="branch_code" defaultValue={editing?.branch_code ?? ""} />
          </label>
          <label>
            Hesap no
            <input className="input" name="account_no" defaultValue={editing?.account_no ?? ""} />
          </label>
          <label>
            IBAN
            <input className="input" name="iban" defaultValue={editing?.iban ?? ""} />
          </label>
          <label>
            Sira
            <input className="input" type="number" name="rank" defaultValue={editing?.rank ?? 0} />
          </label>
          <div className="wide">
            <button className="button" type="submit">
              {editing ? "Guncelle" : "Ekle"}
            </button>
            {editing ? (
              <Link href="/admin/bank-accounts" style={{ marginLeft: 12 }}>
                Iptal
              </Link>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Banka</th>
              <th>Hesap</th>
              <th>IBAN</th>
              <th>Islem</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.bank_name}</td>
                <td>{account.account_name}</td>
                <td>{account.iban || "-"}</td>
                <td>
                  <Link href={`/admin/bank-accounts?edit=${account.id}`}>Duzenle</Link>
                  <form action={deleteBankAccount} style={{ display: "inline", marginLeft: 12 }}>
                    <input type="hidden" name="id" value={account.id} />
                    <button className="button button-warning" type="submit">
                      Sil
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
