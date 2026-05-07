import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext(null);

const initialState = {
  isAuthenticated: false,
  user: null,
  hewan: [],
  peserta: [],
  pembayaran: [],
  distribusi: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    case 'SET_HEWAN':      return { ...state, hewan: action.payload };
    case 'ADD_HEWAN':      return { ...state, hewan: [...state.hewan, action.payload] };
    case 'UPDATE_HEWAN':   return { ...state, hewan: state.hewan.map(h => h.id === action.payload.id ? action.payload : h) };
    case 'DELETE_HEWAN':   return { ...state, hewan: state.hewan.filter(h => h.id !== action.payload) };
    case 'SET_PESERTA':    return { ...state, peserta: action.payload };
    case 'ADD_PESERTA':    return { ...state, peserta: [...state.peserta, action.payload] };
    case 'UPDATE_PESERTA': return { ...state, peserta: state.peserta.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PESERTA': return { ...state, peserta: state.peserta.filter(p => p.id !== action.payload) };
    case 'SET_PEMBAYARAN':    return { ...state, pembayaran: action.payload };
    case 'ADD_PEMBAYARAN':    return { ...state, pembayaran: [...state.pembayaran, action.payload] };
    case 'UPDATE_PEMBAYARAN': return { ...state, pembayaran: state.pembayaran.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'SET_DISTRIBUSI':    return { ...state, distribusi: action.payload };
    case 'ADD_DISTRIBUSI':    return { ...state, distribusi: [...state.distribusi, action.payload] };
    case 'UPDATE_DISTRIBUSI': return { ...state, distribusi: state.distribusi.map(d => d.id === action.payload.id ? action.payload : d) };
    case 'DELETE_DISTRIBUSI': return { ...state, distribusi: state.distribusi.filter(d => d.id !== action.payload) };
    default: return state;
  }
}

// ============================================================
// Supabase CRUD Helpers
// ============================================================

export async function fetchAllData(dispatch) {
  const [hewanRes, pesertaRes, pembayaranRes, distribusiRes] = await Promise.all([
    supabase.from('hewan').select('*').order('id'),
    supabase.from('peserta').select('*').order('id'),
    supabase.from('pembayaran').select('*').order('id'),
    supabase.from('distribusi').select('*').order('id'),
  ]);

  if (hewanRes.data)      dispatch({ type: 'SET_HEWAN',      payload: hewanRes.data });
  if (pesertaRes.data)    dispatch({ type: 'SET_PESERTA',    payload: pesertaRes.data });
  if (pembayaranRes.data) dispatch({ type: 'SET_PEMBAYARAN', payload: pembayaranRes.data });
  if (distribusiRes.data) dispatch({ type: 'SET_DISTRIBUSI', payload: distribusiRes.data });
}

// Helper: ambil user_id dari session aktif
async function getUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  const id = session?.user?.id;
  if (!id) console.error("Gagal mendapatkan User ID: Session tidak ditemukan");
  return id;
}

// Hewan
export async function dbAddHewan(dispatch, data) {
  const { nama, jenis, berat, harga, status, keterangan } = data;
  const user_id = await getUserId();
  
  if (!user_id) return { error: { message: "Sesi Anda habis. Silakan login kembali." } };

  const { data: result, error } = await supabase
    .from('hewan')
    .insert([{ 
      nama, 
      jenis, 
      berat: Number(berat), 
      harga: Number(harga), 
      status, 
      keterangan, 
      user_id 
    }])
    .select()
    .single();
    
  if (!error && result) dispatch({ type: 'ADD_HEWAN', payload: result });
  return { error };
}

export async function dbUpdateHewan(dispatch, data) {
  const { id, nama, jenis, berat, harga, status, keterangan } = data;
  const { data: result, error } = await supabase
    .from('hewan')
    .update({ nama, jenis, berat: Number(berat), harga: Number(harga), status, keterangan })
    .eq('id', id)
    .select()
    .single();
  if (!error && result) dispatch({ type: 'UPDATE_HEWAN', payload: result });
  return { error };
}

export async function dbDeleteHewan(dispatch, id) {
  const { error } = await supabase.from('hewan').delete().eq('id', id);
  if (!error) dispatch({ type: 'DELETE_HEWAN', payload: id });
  return { error };
}

// Peserta
export async function dbAddPeserta(dispatch, data) {
  const { nama, telepon, alamat, jenisQurban, share, idHewan, status } = data;
  const user_id = await getUserId();
  
  if (!user_id) return { error: { message: "Sesi Anda habis. Silakan login kembali." } };

  const { data: result, error } = await supabase
    .from('peserta')
    .insert([{ 
      nama, 
      telepon, 
      alamat, 
      jenis_qurban: jenisQurban, 
      share, 
      id_hewan: idHewan || null, 
      status, 
      user_id 
    }])
    .select()
    .single();
    
  if (!error && result) dispatch({ type: 'ADD_PESERTA', payload: mapPeserta(result) });
  return { error };
}

export async function dbUpdatePeserta(dispatch, data) {
  const { id, nama, telepon, alamat, jenisQurban, share, idHewan, status } = data;
  const { data: result, error } = await supabase
    .from('peserta')
    .update({ nama, telepon, alamat, jenis_qurban: jenisQurban, share, id_hewan: idHewan || null, status })
    .eq('id', id)
    .select()
    .single();
  if (!error && result) dispatch({ type: 'UPDATE_PESERTA', payload: mapPeserta(result) });
  return { error };
}

export async function dbDeletePeserta(dispatch, id) {
  const { error } = await supabase.from('peserta').delete().eq('id', id);
  if (!error) dispatch({ type: 'DELETE_PESERTA', payload: id });
  return { error };
}

// Pembayaran
export async function dbAddPembayaran(dispatch, data) {
  const { namaPeserta, totalTagihan, terbayar, status, metode, tanggal } = data;
  const user_id = await getUserId();
  
  if (!user_id) return { error: { message: "Sesi Anda habis. Silakan login kembali." } };

  const { data: result, error } = await supabase
    .from('pembayaran')
    .insert([{ 
      nama_peserta: namaPeserta, 
      total_tagihan: Number(totalTagihan), 
      terbayar: Number(terbayar), 
      status, 
      metode, 
      tanggal, 
      user_id 
    }])
    .select()
    .single();
    
  if (!error && result) dispatch({ type: 'ADD_PEMBAYARAN', payload: mapPembayaran(result) });
  return { error };
}

export async function dbUpdatePembayaran(dispatch, data) {
  const { id, namaPeserta, totalTagihan, terbayar, status, metode, tanggal } = data;
  const { data: result, error } = await supabase
    .from('pembayaran')
    .update({ nama_peserta: namaPeserta, total_tagihan: Number(totalTagihan), terbayar: Number(terbayar), status, metode, tanggal })
    .eq('id', id)
    .select()
    .single();
  if (!error && result) dispatch({ type: 'UPDATE_PEMBAYARAN', payload: mapPembayaran(result) });
  return { error };
}

// Distribusi
export async function dbAddDistribusi(dispatch, data) {
  const { penerima, kategori, beratDaging, status, tanggal } = data;
  const user_id = await getUserId();
  
  if (!user_id) return { error: { message: "Sesi Anda habis. Silakan login kembali." } };

  const { data: result, error } = await supabase
    .from('distribusi')
    .insert([{ 
      penerima, 
      kategori, 
      berat_daging: Number(beratDaging), 
      status, 
      tanggal, 
      user_id 
    }])
    .select()
    .single();
    
  if (!error && result) dispatch({ type: 'ADD_DISTRIBUSI', payload: mapDistribusi(result) });
  return { error };
}

export async function dbUpdateDistribusi(dispatch, data) {
  const { id, penerima, kategori, beratDaging, status, tanggal } = data;
  const { data: result, error } = await supabase
    .from('distribusi')
    .update({ penerima, kategori, berat_daging: Number(beratDaging), status, tanggal })
    .eq('id', id)
    .select()
    .single();
  if (!error && result) dispatch({ type: 'UPDATE_DISTRIBUSI', payload: mapDistribusi(result) });
  return { error };
}

export async function dbDeleteDistribusi(dispatch, id) {
  const { error } = await supabase.from('distribusi').delete().eq('id', id);
  if (!error) dispatch({ type: 'DELETE_DISTRIBUSI', payload: id });
  return { error };
}

// ============================================================
// Mappers: snake_case (DB) → camelCase (App)
// ============================================================
export function mapPeserta(row) {
  return { ...row, jenisQurban: row.jenis_qurban, idHewan: row.id_hewan };
}

export function mapPembayaran(row) {
  return { ...row, namaPeserta: row.nama_peserta, totalTagihan: row.total_tagihan, terbayar: row.terbayar };
}

export function mapDistribusi(row) {
  return { ...row, beratDaging: row.berat_daging };
}

// ============================================================
// Provider
// ============================================================
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch({ type: 'LOGIN', payload: { email: session.user.email, nama: session.user.user_metadata?.nama || session.user.email.split('@')[0], role: 'Admin' } });
        fetchAndMap(dispatch).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch({ type: 'LOGIN', payload: { email: session.user.email, nama: session.user.user_metadata?.nama || session.user.email.split('@')[0], role: 'Admin' } });
        fetchAndMap(dispatch);
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f0d', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '48px' }}>🐑</div>
        <div style={{ color: '#10b981', fontSize: '14px', fontWeight: 600 }}>Memuat Qurbanku...</div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

async function fetchAndMap(dispatch) {
  const [hewanRes, pesertaRes, pembayaranRes, distribusiRes] = await Promise.all([
    supabase.from('hewan').select('*').order('id'),
    supabase.from('peserta').select('*').order('id'),
    supabase.from('pembayaran').select('*').order('id'),
    supabase.from('distribusi').select('*').order('id'),
  ]);

  if (hewanRes.data)      dispatch({ type: 'SET_HEWAN',      payload: hewanRes.data });
  if (pesertaRes.data)    dispatch({ type: 'SET_PESERTA',    payload: pesertaRes.data.map(mapPeserta) });
  if (pembayaranRes.data) dispatch({ type: 'SET_PEMBAYARAN', payload: pembayaranRes.data.map(mapPembayaran) });
  if (distribusiRes.data) dispatch({ type: 'SET_DISTRIBUSI', payload: distribusiRes.data.map(mapDistribusi) });
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
