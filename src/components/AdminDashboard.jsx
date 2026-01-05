import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Plus, Trash2, Upload, User, FileText, 
  BarChart, MessageSquare, Settings, Bell, Edit, X, Eye, Save, Globe, Loader2, Calendar
} from 'lucide-react';
import { auth } from '../utils/auth';
import { storage, STORAGE_KEYS } from '../utils/storage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [data, setData] = useState({ 
    projects: [], profile: {}, stats: [], faqs: [], social: {}, cv: {}, popup: {} 
  });

  // FIX: Hapus pengecekan auth di sini karena sudah dicek di Admin.jsx
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [pjs, prof, st, fq, soc, cv, pop] = await Promise.all([
        storage.get(STORAGE_KEYS.PROJECTS),
        storage.get(STORAGE_KEYS.PROFILE),
        storage.get(STORAGE_KEYS.STATS),
        storage.get(STORAGE_KEYS.FAQ),
        storage.get(STORAGE_KEYS.SOCIAL_LINKS),
        storage.get(STORAGE_KEYS.CV_URL),
        storage.get(STORAGE_KEYS.POPUP_SETTINGS)
      ]);
      setData({
        projects: pjs || [],
        profile: prof || { name: '', title: '', description: '', bio: '', image: '' },
        stats: st || [],
        faqs: fq || [],
        social: soc || { linkedin: '', instagram: '', email: '', whatsapp: '' },
        cv: cv || { file_url: '' },
        popup: pop || { title: '', content: '', image: '', is_active: true }
      });
    } catch (error) {
      console.error('Error loading data:', error);
      Swal.fire('Error', 'Failed to load data. Please refresh the page.', 'error');
    }
  };

  const confirmAction = async (title, text) => {
    const res = await Swal.fire({
      title, text, icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C8AE7E',
      confirmButtonText: 'Ya, Lanjutkan!',
      cancelButtonText: 'Batal'
    });
    return res.isConfirmed;
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FAFDF3] font-inter">
      <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-2xl font-playfair font-bold text-beige-dark">Admin Panel Tiara</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </header>

      <div className="flex flex-col lg:flex-row p-4 lg:p-8 gap-8">
        <div className="w-full lg:w-64 space-y-2">
          {[
            { id: 'projects', label: 'Projects', icon: FileText },
            { id: 'profile', label: 'Profile Settings', icon: User },
            { id: 'stats', label: 'Stats Manager', icon: BarChart },
            { id: 'faq', label: 'FAQ Manager', icon: MessageSquare },
            { id: 'settings', label: 'Social & CV', icon: Settings },
            { id: 'popup', label: 'Welcome Popup', icon: Bell }
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                activeTab === t.id ? 'bg-beige-dark text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-beige-lighter'
              }`}>
              <t.icon size={20} /> {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-3xl p-6 lg:p-10 shadow-xl min-h-[75vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'projects' && <ProjectSection data={data.projects} refresh={loadAll} confirm={confirmAction} key="projects" />}
            {activeTab === 'profile' && <ProfileSection data={data.profile} refresh={loadAll} confirm={confirmAction} key="profile" />}
            {activeTab === 'stats' && <StatsSection data={data.stats} refresh={loadAll} confirm={confirmAction} key="stats" />}
            {activeTab === 'faq' && <FaqSection data={data.faqs} refresh={loadAll} confirm={confirmAction} key="faq" />}
            {activeTab === 'settings' && <SocialSection social={data.social} cv={data.cv} refresh={loadAll} confirm={confirmAction} key="settings" />}
            {activeTab === 'popup' && <PopupSection data={data.popup} refresh={loadAll} confirm={confirmAction} key="popup" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ProjectSection Component (sama seperti sebelumnya, tidak ada perubahan)
const ProjectSection = ({ data, refresh, confirm }) => {
  const [isAdd, setIsAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'Social Media', description: '', full_description: '', image: '', link: '', date: '' });
  const [up, setUp] = useState(false);

  const onDrop = async (acceptedFiles) => {
    setUp(true);
    const file = acceptedFiles[0];
    const url = await storage.uploadFile('project-images', file);
    if (url) setForm(prev => ({ ...prev, image: url }));
    setUp(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    maxFiles: 1,
    accept: {'image/*': []},
    disabled: up
  });

  const handleEdit = (pj) => {
    setForm({
      title: pj.title || '',
      category: pj.category || 'Social Media',
      description: pj.description || '',
      full_description: pj.full_description || '',
      image: Array.isArray(pj.image) ? pj.image[0] : (pj.image || ''),
      link: pj.link || '',
      date: pj.date || ''
    });
    setEditingId(pj.id);
    setIsAdd(true);
  };

  const openAddForm = () => {
    setForm({ title: '', category: 'Social Media', description: '', full_description: '', image: '', link: '', date: '' });
    setEditingId(null);
    setIsAdd(true);
  };

  const save = async () => {
    if(!form.title) return Swal.fire('Error', 'Judul proyek wajib diisi!', 'error');
    if(!form.image) return Swal.fire('Error', 'Foto proyek wajib diunggah!', 'error');
    if(!await confirm('Simpan Proyek?', 'Data akan diperbarui.')) return;

    const payload = { ...form };
    if (editingId) payload.id = editingId;
    const { error } = await storage.set(STORAGE_KEYS.PROJECTS, payload);
    
    if(!error) {
      Swal.fire('Berhasil!', 'Proyek berhasil disimpan.', 'success');
      setIsAdd(false); setEditingId(null);
      refresh();
    } else {
      Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan data.', 'error');
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Project Management</h2>
        {!isAdd && <button onClick={openAddForm} className="btn-primary flex items-center gap-2"><Plus size={18}/> Add Project</button>}
      </div>

      {isAdd ? (
        <div className="space-y-6 bg-white p-8 rounded-3xl border border-beige-light shadow-sm">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-xl font-playfair font-bold text-beige-dark">{editingId ? 'Edit Project' : 'New Project'}</h3>
            <button onClick={() => setIsAdd(false)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all"><X size={24} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Project Title</label>
                <input type="text" placeholder="Title" value={form.title} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-beige-dark" onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Role</label>
                  <select 
                    value={form.category} 
                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-beige-dark bg-white"
                    onChange={e => setForm({...form, category: e.target.value})}
                  >
                    <option value="Social Media">Social Media</option>
                    <option value="Content Creator">Content Creator</option>
                    <option value="Content Production">Content Production</option>
                    <option value="Creative Campaign">Creative Campaign</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Project Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 text-gray-400" size={16} />
                    <input 
                      type="date" 
                      value={form.date} 
                      className="w-full p-3 pl-10 border rounded-xl outline-none focus:ring-2 focus:ring-beige-dark bg-white" 
                      onChange={e => setForm({...form, date: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">External Link</label>
                <div className="relative">
                    <Globe className="absolute left-3 top-4 text-gray-400" size={18} />
                    <input type="text" placeholder="https://..." value={form.link} className="w-full p-3 pl-10 border rounded-xl outline-none focus:ring-2 focus:ring-beige-dark" onChange={e => setForm({...form, link: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Image</label>
              {form.image && !up ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden border group shadow-sm">
                  <img src={form.image} className="w-full h-full object-cover" alt="Preview" />
                  <button onClick={() => setForm({...form, image: ''})} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div {...getRootProps()} className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer aspect-video flex flex-col items-center justify-center ${isDragActive ? 'border-beige-dark bg-beige-lighter/30' : 'border-gray-200 bg-gray-50 hover:border-beige-dark'} ${up ? 'cursor-not-allowed opacity-70' : ''}`}>
                  <input {...getInputProps()} />
                  {up ? (
                    <div className="flex flex-col items-center animate-pulse">
                      <Loader2 className="w-12 h-12 text-beige-dark animate-spin mb-3" />
                      <p className="text-sm font-semibold text-beige-dark">Uploading Image...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-beige-lighter rounded-full flex items-center justify-center text-beige-dark mb-3"><Upload size={24} /></div>
                      <p className="text-sm font-semibold text-gray-600">Click or Drag Image</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Short Description</label>
                <textarea placeholder="Brief summary" value={form.description} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-beige-dark h-32" onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Case Study Details</label>
                <textarea placeholder="Full Details" value={form.full_description} className="w-full p-3 border rounded-xl h-32 outline-none focus:ring-2 focus:ring-beige-dark" onChange={e => setForm({...form, full_description: e.target.value})} />
              </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button disabled={up} onClick={save} className={`btn-primary flex-1 py-4 flex items-center justify-center gap-2 ${up ? 'opacity-50' : ''}`}>
              {up ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save Project
            </button>
            <button onClick={() => setIsAdd(false)} className="px-8 py-4 bg-gray-100 text-gray-600 rounded-full font-bold">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((p) => (
            <div key={p.id} className="p-4 border rounded-2xl flex justify-between items-center bg-white group shadow-sm hover:shadow-md transition-all">
              <div className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden border">
                  <img src={p.image} className="w-full h-full object-cover" alt="" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.title)}&background=D2BD96&color=fff&size=150`; }} />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{p.title}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{p.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="p-2 text-beige-dark hover:bg-beige-lighter rounded-lg transition-colors"><Edit size={20}/></button>
                <button onClick={async () => { if(await confirm('Hapus Proyek?')){ await storage.delete(STORAGE_KEYS.PROJECTS, p.id); refresh(); }}} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ProfileSection, StatsSection, FaqSection, SocialSection, PopupSection tetap sama
// (Saya skip karena tidak ada perubahan, terlalu panjang)
// Copy dari code asli untuk section-section ini

const ProfileSection = ({ data, refresh, confirm }) => {
  const [f, setF] = useState(data);
  const [up, setUp] = useState(false);

  const onDropProfile = async (files) => {
    setUp(true);
    const url = await storage.uploadFile('profile-images', files[0]);
    if (url) {
      setF({ ...f, image: url });
      Swal.fire('Berhasil!', 'Foto profil terpilih.', 'success');
    }
    setUp(false);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: onDropProfile,
    noClick: true, 
    noKeyboard: true,
    maxFiles: 1,
    accept: { 'image/*': [] }
  });

  const handleUpdateProfile = async () => {
    if (!await confirm('Update Profil?', 'Data profil utama akan diubah.')) return;
    const { error } = await storage.set(STORAGE_KEYS.PROFILE, f);
    if (!error) {
      Swal.fire('Berhasil!', 'Profil telah diperbarui.', 'success');
      refresh();
    } else {
      Swal.fire('Gagal', 'Gagal memperbarui profil.', 'error');
    }
  };

  return (
    <div className="max-w-2xl space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        <p className="text-sm text-gray-400 italic">Kelola informasi utama yang muncul di bagian Hero.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-50 rounded-3xl border border-dashed">
        <div className="relative">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-beige-lighter flex items-center justify-center">
            {up ? (
              <Loader2 className="w-10 h-10 text-beige-dark animate-spin" />
            ) : f.image ? (
              <img src={f.image} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <User className="w-16 h-16 text-beige-dark" />
            )}
          </div>
        </div>

        <div className="space-y-3 text-center md:text-left">
          <p className="text-sm font-bold text-gray-700 uppercase tracking-widest">Foto Profile</p>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <button
              onClick={open}
              disabled={up}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                up ? 'bg-gray-300 cursor-not-allowed' : 'bg-beige-dark text-white hover:bg-beige shadow-md'
              }`}
            >
              {up ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
              {up ? 'Uploading...' : 'Pilih Foto'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Nama Lengkap</label>
          <input type="text" value={f.name} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-beige-dark outline-none" onChange={e => setF({ ...f, name: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Tagline</label>
          <input type="text" value={f.title} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-beige-dark outline-none" onChange={e => setF({ ...f, title: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Bio</label>
          <textarea value={f.description} className="w-full p-3 border rounded-xl h-32 focus:ring-2 focus:ring-beige-dark outline-none" onChange={e => setF({ ...f, description: e.target.value })} />
        </div>
      </div>

      <button onClick={handleUpdateProfile} disabled={up} className="btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-lg">
        <Save size={20} /> Update Profile
      </button>
    </div>
  );
};

const StatsSection = ({ data, refresh, confirm }) => {
  const [isAdd, setIsAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ label: '', value: '' });

  const handleEdit = (item) => {
    setForm({ label: item.label, value: item.value });
    setEditingId(item.id);
    setIsAdd(true);
  };

  const openAddForm = () => {
    setForm({ label: '', value: '' });
    setEditingId(null);
    setIsAdd(true);
  };

  const save = async () => {
    if (!form.label || !form.value) return Swal.fire('Error', 'Semua kolom wajib diisi!', 'error');
    if (!await confirm('Simpan Statistik?', 'Data akan diperbarui.')) return;

    let updatedStats;
    if (editingId) {
      updatedStats = data.map(item => item.id === editingId ? { ...item, ...form } : item);
    } else {
      updatedStats = [...data, { ...form, id: Date.now() }];
    }

    const { error } = await storage.set(STORAGE_KEYS.STATS, updatedStats);
    if (!error) {
      Swal.fire('Berhasil!', 'Statistik disimpan.', 'success');
      setIsAdd(false); setEditingId(null); refresh();
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stats Manager</h2>
        {!isAdd && <button onClick={openAddForm} className="btn-primary flex items-center gap-2"><Plus size={18} /> Add Card</button>}
      </div>

      {isAdd ? (
        <div className="space-y-6 bg-white p-8 rounded-3xl border shadow-sm">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-xl font-playfair font-bold text-beige-dark">{editingId ? 'Edit Stat' : 'New Stat'}</h3>
            <button onClick={() => setIsAdd(false)} className="text-gray-400 hover:text-red-500 transition-all"><X size={24} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Value (e.g. 50+)" value={form.value} className="w-full p-3 border rounded-xl outline-none" onChange={e => setForm({ ...form, value: e.target.value })} />
            <input type="text" placeholder="Label (e.g. Projects Done)" value={form.label} className="w-full p-3 border rounded-xl outline-none" onChange={e => setForm({ ...form, label: e.target.value })} />
          </div>
          <div className="flex gap-4 pt-4 border-t">
            <button onClick={save} className="btn-primary flex-1 py-4 flex items-center justify-center gap-2"><Save size={20} /> Save Changes</button>
            <button onClick={() => setIsAdd(false)} className="px-8 py-4 bg-gray-100 rounded-full font-bold">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((item) => (
            <div key={item.id} className="p-6 border rounded-3xl bg-white shadow-sm relative group hover:border-beige-dark transition-all">
              <div className="text-center"><p className="text-3xl font-bold text-beige-dark">{item.value}</p><p className="text-xs text-gray-500 uppercase">{item.label}</p></div>
              <div className="absolute top-2 right-2 flex gap-1 transition-all">
                <button onClick={() => handleEdit(item)} className="p-2 bg-beige-lighter text-beige-dark rounded-full hover:bg-beige-dark hover:text-white"><Edit size={14} /></button>
                <button onClick={async () => { if(await confirm('Hapus?')){ const updated = data.filter(i => i.id !== item.id); await storage.set(STORAGE_KEYS.STATS, updated); refresh(); }}} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FaqSection = ({ data, refresh, confirm }) => {
  const [isAdd, setIsAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '' });

  const handleEdit = (item) => {
    setForm({ question: item.question, answer: item.answer });
    setEditingId(item.id);
    setIsAdd(true);
  };

  const openAddForm = () => {
    setForm({ question: '', answer: '' });
    setEditingId(null);
    setIsAdd(true);
  };

  const save = async () => {
    if (!form.question || !form.answer) return Swal.fire('Error', 'Wajib diisi!', 'error');
    if (!await confirm('Simpan FAQ?')) return;
    let updatedFaq = editingId ? data.map(i => i.id === editingId ? { ...i, ...form } : i) : [...data, { ...form, id: Date.now() }];
    await storage.set(STORAGE_KEYS.FAQ, updatedFaq);
    setIsAdd(false); setEditingId(null); refresh();
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">FAQ Manager</h2>
        {!isAdd && <button onClick={openAddForm} className="btn-primary flex items-center gap-2"><Plus size={18} /> New FAQ</button>}
      </div>
      {isAdd ? (
        <div className="space-y-6 bg-white p-8 rounded-3xl border shadow-sm">
          <div className="flex justify-between items-center border-b pb-4"><h3 className="font-bold">{editingId ? 'Edit FAQ' : 'New FAQ'}</h3><button onClick={() => setIsAdd(false)}><X/></button></div>
          <input type="text" placeholder="Question" value={form.question} className="w-full p-3 border rounded-xl outline-none" onChange={e => setForm({ ...form, question: e.target.value })} />
          <textarea placeholder="Answer" value={form.answer} className="w-full p-3 border rounded-xl h-40 outline-none" onChange={e => setForm({ ...form, answer: e.target.value })} />
          <button onClick={save} className="btn-primary w-full py-4 shadow-lg"><Save size={20} className="inline mr-2"/> Save FAQ</button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="p-4 border rounded-2xl flex justify-between items-center bg-white group shadow-sm hover:border-beige-dark transition-all">
              <div className="flex-1 truncate pr-4"><p className="font-bold text-sm text-gray-800">{item.question}</p></div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(item)} className="p-2 text-beige-dark hover:bg-beige-lighter rounded-lg transition-colors"><Edit size={16}/></button>
                <button onClick={async () => { if(await confirm('Hapus?')){ const updated = data.filter(i => i.id !== item.id); await storage.set(STORAGE_KEYS.FAQ, updated); refresh(); }}} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SocialSection = ({ social, cv, refresh, confirm }) => {
  const [f, setF] = useState(social);
  const [up, setUp] = useState(false);

  const onDropCV = async (files) => {
    setUp(true);
    const url = await storage.uploadFile('cv-files', files[0]);
    if(url) {
      await storage.set(STORAGE_KEYS.CV_URL, { file_url: url });
      Swal.fire('Berhasil!', 'CV diperbarui.', 'success');
      refresh();
    }
    setUp(false);
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop: onDropCV, 
    maxFiles: 1, 
    accept: {'application/pdf': []},
    disabled: up
  });

  return (
    <div className="space-y-10 animate-fadeIn">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Social Media Links</h2>
        <p className="text-sm text-gray-400 italic mb-4">Input link lengkap untuk Sosmed, dan cukup nama/nomor untuk Email & WA.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['linkedin', 'instagram', 'email', 'whatsapp'].map(k => (
            <div key={k}>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-1">{k}</label>
              <input type="text" value={f[k]} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-beige-dark transition-all" onChange={e => setF({...f, [k]: e.target.value})} />
            </div>
          ))}
        </div>
        <button onClick={async () => { if(await confirm('Simpan Sosmed?')){ await storage.set(STORAGE_KEYS.SOCIAL_LINKS, f); refresh(); }}} className="btn-primary mt-6">Save Links</button>
      </section>

      <section className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">CV Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div {...getRootProps()} className={`border-2 border-dashed border-beige-dark p-8 rounded-3xl text-center bg-gray-50 hover:bg-beige-lighter ${up ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} transition-all`}>
            <input {...getInputProps()} />
            {up ? <Loader2 className="mx-auto text-beige-dark animate-spin mb-2" /> : <Upload className="mx-auto text-beige-dark mb-2" />}
            <p className="text-sm font-bold text-gray-600">{up ? "Uploading PDF..." : "Update CV (PDF)"}</p>
          </div>
          <div className="bg-white border rounded-3xl p-6 flex flex-col justify-center shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-beige-lighter rounded-2xl text-beige-dark"><FileText size={30} /></div>
              <p className="text-sm font-bold truncate text-gray-800">{cv?.file_url ? "Active_CV_File.pdf" : "No CV"}</p>
            </div>
            {cv?.file_url && (
              <div className="flex gap-2">
                <button onClick={() => window.open(cv.file_url, '_blank')} className="flex-1 py-2 bg-gray-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-beige-lighter transition-colors"><Eye size={14}/> View</button>
                <button onClick={async () => { if(await confirm('Hapus CV?')){ await storage.delete(STORAGE_KEYS.CV_URL, cv.id); refresh(); }}} className="flex-1 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/> Delete</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const PopupSection = ({ data, refresh, confirm }) => {
  const [f, setF] = useState(data);
  const [up, setUp] = useState(false);

  const onDropPopup = async (files) => {
    setUp(true);
    const url = await storage.uploadFile('popup-images', files[0]);
    if (url) {
      setF({ ...f, image: url });
      Swal.fire('Berhasil!', 'Foto Popup terpilih.', 'success');
    }
    setUp(false);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: onDropPopup,
    noClick: true, 
    maxFiles: 1,
    accept: { 'image/*': [] }
  });

  const save = async () => {
    if (!await confirm('Simpan Popup?')) return;
    await storage.set(STORAGE_KEYS.POPUP_SETTINGS, f);
    Swal.fire('Berhasil!', 'Popup telah diperbarui.', 'success');
    refresh();
  };

  return (
    <div className="max-w-2xl space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome Popup Settings</h2>
        <p className="text-sm text-gray-400 italic">Atur pesan sambutan otomatis untuk pengunjung baru.</p>
      </div>

      <div className="p-4 bg-beige-lighter/50 rounded-2xl flex items-center justify-between border border-beige-light shadow-sm">
        <span className="font-bold text-gray-700">Popup Status</span>
        <button onClick={() => setF({...f, is_active: !f.is_active})} className={`px-8 py-2 rounded-full font-bold text-white transition-all ${f.is_active ? 'bg-green-500 shadow-md' : 'bg-red-500 shadow-sm'}`}>
          {f.is_active ? 'ACTIVE' : 'OFF'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-50 rounded-3xl border border-dashed">
        <div className="relative">
          <div className="w-48 h-32 rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-beige-lighter flex items-center justify-center">
            {up ? (
              <Loader2 className="w-8 h-8 text-beige-dark animate-spin" />
            ) : f.image ? (
              <img src={f.image} className="w-full h-full object-cover" alt="Popup" />
            ) : (
              <Bell className="w-10 h-10 text-beige-dark" />
            )}
          </div>
        </div>

        <div className="space-y-3 text-center md:text-left">
          <p className="text-sm font-bold text-gray-700 uppercase tracking-widest">Popup Image</p>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <button
              onClick={open}
              disabled={up}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                up ? 'bg-gray-300 cursor-not-allowed' : 'bg-beige-dark text-white hover:bg-beige shadow-sm active:scale-95'
              }`}
            >
              {up ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
              {up ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase block mb-1 tracking-widest">Popup Title</label>
          <input type="text" value={f.title} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-beige-dark outline-none bg-white shadow-sm transition-all" onChange={e => setF({...f, title: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase block mb-1 tracking-widest">Popup Content</label>
          <textarea value={f.content} className="w-full p-3 border rounded-xl h-32 focus:ring-2 focus:ring-beige-dark outline-none bg-white shadow-sm transition-all" onChange={e => setF({...f, content: e.target.value})} />
        </div>
      </div>

      <button onClick={save} disabled={up} className="btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-lg shadow-beige-dark/20 transition-all">
        <Save size={20}/> Update Popup Settings
      </button>
    </div>
  );
};

export default AdminDashboard;