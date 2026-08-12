const fs = require('fs');
const file = 'pages/AdminPages.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetBegin = 'const PartnersManager = () => {';
const targetEnd = 'const NewsletterManager = () => {';
const beforePart = content.substring(0, content.indexOf(targetBegin));
const afterPart = content.substring(content.indexOf(targetEnd));

const newPartnersManager = `const PartnersManager = () => {
  const [tab, setTab] = useState<"inquiries" | "active" | "archived">("inquiries");
  const [partners, setPartners] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ organization: "", logo_url: "", message: "", contact_name: "", email: "", phone: "" });

  const fetch = async () => {
    if (isSupabaseConfigured()) {
      const query = supabase
        .from("partnership_inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (tab === "inquiries") query.in("status", ["new", "contacted"]);
      else query.eq("status", tab === "active" ? "active" : "archived");
      const { data } = await query;
      if (data) setPartners(data);
    }
  };

  useEffect(() => {
    fetch();
  }, [tab]);

  const updateStatus = async (id: number, status: string) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("partnership_inquiries")
        .update({ status })
        .eq("id", id)
        .select();
      if (error) customAlert("Error: " + error.message);
      else if (!data || data.length === 0) customAlert("Permission denied.");
      else {
        if (
          (tab === "inquiries" && status === "active") ||
          (tab === "active" && status === "archived")
        ) {
          setPartners((prev) => prev.filter((p) => p.id !== id));
        } else {
          setPartners((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status } : p)),
          );
        }
      }
    }
  };

  const savePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return;
    
    const payload = {
        organization: form.organization,
        logo_url: form.logo_url,
        message: form.message,
        contact_name: form.contact_name,
        email: form.email,
        phone: form.phone,
        status: 'active',
        inquiry_type: 'Manual Addition'
    };

    if (editingId) {
        const { error } = await supabase.from('partnership_inquiries').update({ organization: form.organization, logo_url: form.logo_url, message: form.message }).eq('id', editingId);
        if (error) customAlert(error.message);
        else {
            setShowAddForm(false);
            setEditingId(null);
            setForm({ organization: "", logo_url: "", message: "", contact_name: "", email: "", phone: "" });
            fetch();
        }
    } else {
        const { error } = await supabase.from('partnership_inquiries').insert(payload);
        if (error) customAlert(error.message);
        else {
            setShowAddForm(false);
            setForm({ organization: "", logo_url: "", message: "", contact_name: "", email: "", phone: "" });
            if (tab === 'active') fetch();
            else setTab('active');
        }
    }
  };

  const startEdit = (p: any) => {
      setEditingId(p.id);
      setForm({
          organization: p.organization || "",
          logo_url: p.logo_url || "",
          message: p.message || "",
          contact_name: p.contact_name || "",
          email: p.email || "",
          phone: p.phone || ""
      });
      setShowAddForm(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-blue">
            Partnership Management
          </h2>
          <button onClick={() => {
              setEditingId(null);
              setForm({ organization: "", logo_url: "", message: "", contact_name: "", email: "", phone: "" });
              setShowAddForm(true);
          }} className="bg-brand-blue text-white px-4 py-2 rounded-xl text-sm font-bold shadow-skeuo-raised hover:-translate-y-0.5 transition flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Partner Manually
          </button>
      </div>
      
      {showAddForm && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">{editingId ? 'Edit Partner Details' : 'Add New Partner'}</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={savePartner} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Organization Name</label>
                          <input required type="text" value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-brand-blue" />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Logo URL (Optional)</label>
                          <input type="text" value={form.logo_url} onChange={e => setForm({...form, logo_url: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-brand-blue" placeholder="https://..." />
                      </div>
                  </div>
                  {!editingId && (
                      <div className="grid grid-cols-3 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Name</label>
                              <input type="text" value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-brand-blue" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-brand-blue" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                              <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-brand-blue" />
                          </div>
                      </div>
                  )}
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description / Message</label>
                      <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={3} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-brand-blue resize-none"></textarea>
                  </div>
                  <button type="submit" className="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold">Save Partner</button>
              </form>
          </div>
      )}

      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setTab("inquiries")}
          className={\`px-4 py-3 text-sm font-bold border-b-2 transition \${tab === "inquiries" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-brand-blue"}\`}
        >
          New Inquiries
        </button>
        <button
          onClick={() => setTab("active")}
          className={\`px-4 py-3 text-sm font-bold border-b-2 transition \${tab === "active" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-brand-blue"}\`}
        >
          Active Partners
        </button>
        <button
          onClick={() => setTab("archived")}
          className={\`px-4 py-3 text-sm font-bold border-b-2 transition \${tab === "archived" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-brand-blue"}\`}
        >
          Archived
        </button>
      </div>
      <div className="grid gap-4">
        {partners.map((p) => (
          <div
            key={p.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4 transition hover:shadow-md"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {p.logo_url && <img src={p.logo_url} alt={p.organization} className="w-8 h-8 rounded-full object-cover border border-gray-200" />}
                <h3 className="font-bold text-lg text-gray-800">
                  {p.organization}
                </h3>
                <span
                  className={\`text-[10px] uppercase font-bold px-2 py-0.5 rounded \${p.status === "new" ? "bg-blue-100 text-blue-700" : p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}\`}
                >
                  {p.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2 font-medium">
                Contact: {p.contact_name}{" "}
                <span className="text-gray-300">|</span> {p.email}{" "}
                <span className="text-gray-300">|</span> {p.phone}
              </p>
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 max-w-3xl">
                <span className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  {p.inquiry_type}
                </span>
                {p.message}
              </div>
            </div>
            <div className="flex flex-col gap-2 min-w-[140px]">
              {tab === "inquiries" && (
                <>
                  {p.status === "new" && (
                    <button
                      onClick={() => updateStatus(p.id, "contacted")}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-xs font-bold transition"
                    >
                      Mark Contacted
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus(p.id, "active")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    Onboard Partner
                  </button>
                </>
              )}
              {tab === "active" && (
                <>
                  <button
                    onClick={() => startEdit(p)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => updateStatus(p.id, "archived")}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold transition"
                  >
                    Archive Partner
                  </button>
                </>
              )}
              {tab === "archived" && (
                <button
                  onClick={() => updateStatus(p.id, "active")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold transition"
                >
                  Restore
                </button>
              )}
            </div>
          </div>
        ))}
        {partners.length === 0 && (
          <p className="text-center text-gray-400 py-12 font-medium">
            No records found.
          </p>
        )}
      </div>
    </div>
  );
};
`

fs.writeFileSync(file, beforePart + newPartnersManager + afterPart);
console.log("Patched PartnersManager");
