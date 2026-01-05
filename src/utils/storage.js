import { supabase } from './supabaseClient';

export const STORAGE_KEYS = {
  PROJECTS: 'projects',
  PROFILE: 'profile',
  STATS: 'stats',
  FAQ: 'faq',
  SOCIAL_LINKS: 'social_links',
  CV_URL: 'cv_url',
  POPUP_SETTINGS: 'popup_settings'
};

export const storage = {
  async get(tableName) {
    try {
      const { data, error } = await supabase.from(tableName).select('*').order('id', { ascending: true });
      if (error) throw error;
      
      // Data Tunggal
      if (['profile', 'social_links', 'popup_settings', 'cv_url'].includes(tableName)) {
        return data[0] || null;
      }
      return data || [];
    } catch (error) {
      console.error(`Gagal ambil data ${tableName}:`, error);
      return null;
    }
  },

  async set(tableName, value) {
    try {
      // UNTUK STATS & FAQ (Logika Bersihkan & Isi Baru)
      if (['stats', 'faq'].includes(tableName)) {
        // Hapus semua data lama agar tidak duplikat di homepage
        await supabase.from(tableName).delete().neq('id', 0);
        
        if (Array.isArray(value) && value.length > 0) {
          // Buang properti id dan created_at agar tidak bentrok dengan auto-increment Supabase
          const cleanData = value.map(({ id, created_at, ...rest }) => rest);
          return await supabase.from(tableName).insert(cleanData);
        }
        return { data: [] };
      }

      // UNTUK PROJECTS (Gunakan Upsert)
      if (tableName === 'projects') {
        return await supabase.from(tableName).upsert(value);
      }

      // UNTUK PROFILE & SETTINGS (Paksa ID 1 agar data selalu tertimpa)
      if (['profile', 'social_links', 'popup_settings', 'cv_url'].includes(tableName)) {
        return await supabase.from(tableName).upsert({ id: 1, ...value });
      }
    } catch (error) {
      console.error(`Gagal simpan ke ${tableName}:`, error);
      return { error };
    }
  },

  async delete(tableName, id) {
    try {
      await supabase.from(tableName).delete().eq('id', id);
      return true;
    } catch (error) { return false; }
  },

  async uploadFile(bucket, file) {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error('Upload gagal:', error);
      return null;
    }
  }
};