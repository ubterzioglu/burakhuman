import { AdminShell } from "@/components/AdminShell";
import { missingItems, missingItemsByStatus, missingStatusLabels } from "@/lib/missing-items";

const priorityLabels = {
  high: "Yuksek",
  normal: "Normal",
  low: "Dusuk",
};

const summaryCards = [
  { label: "Toplam Madde", value: missingItems.length },
  { label: "Yuksek Oncelik", value: missingItems.filter((item) => item.priority === "high").length },
  { label: "Kismi", value: missingItemsByStatus("partial").length },
  { label: "Faz 2", value: missingItemsByStatus("phase_two").length },
];

export default function AdminMissingPage() {
  return (
    <AdminShell>
      <div className="admin-grid">
        {summaryCards.map((card) => (
          <div className="metric" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h1>Eksik Kalanlar</h1>
        <p>
          Bu liste eski `httpdocs` WebForms sitesi ile yeni Next.js/Supabase uygulamasi arasinda son kontrolde kalan
          farklari gosterir. Asset klasorleri tasindi; ana farklar uyelik, odeme, tam medya yonetimi ve veri migration
          tarafinda.
        </p>
      </div>

      <div className="admin-card missing-section">
        <table className="table missing-table">
          <thead>
            <tr>
              <th>Alan</th>
              <th>Eksik / Fark</th>
              <th>Durum</th>
              <th>Oncelik</th>
              <th>Eski Kaynak</th>
              <th>Yapilacak</th>
            </tr>
          </thead>
          <tbody>
            {missingItems.map((item) => (
              <tr key={item.id}>
                <td>{item.area}</td>
                <td>
                  <strong>{item.title}</strong>
                  <p>{item.currentState}</p>
                </td>
                <td>
                  <span className={`status-pill status-${item.status}`}>{missingStatusLabels[item.status]}</span>
                </td>
                <td>{priorityLabels[item.priority]}</td>
                <td>{item.oldSource}</td>
                <td>{item.needed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
