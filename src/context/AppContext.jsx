import { createContext, useContext, useReducer, useEffect } from 'react';
import { mockHewan, mockPeserta, mockPembayaran, mockDistribusi } from '../data/mockData';

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

    // Hewan
    case 'SET_HEWAN': return { ...state, hewan: action.payload };
    case 'ADD_HEWAN': return { ...state, hewan: [...state.hewan, action.payload] };
    case 'UPDATE_HEWAN': return { ...state, hewan: state.hewan.map(h => h.id === action.payload.id ? action.payload : h) };
    case 'DELETE_HEWAN': return { ...state, hewan: state.hewan.filter(h => h.id !== action.payload) };

    // Peserta
    case 'SET_PESERTA': return { ...state, peserta: action.payload };
    case 'ADD_PESERTA': return { ...state, peserta: [...state.peserta, action.payload] };
    case 'UPDATE_PESERTA': return { ...state, peserta: state.peserta.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PESERTA': return { ...state, peserta: state.peserta.filter(p => p.id !== action.payload) };

    // Pembayaran
    case 'SET_PEMBAYARAN': return { ...state, pembayaran: action.payload };
    case 'ADD_PEMBAYARAN': return { ...state, pembayaran: [...state.pembayaran, action.payload] };
    case 'UPDATE_PEMBAYARAN': return { ...state, pembayaran: state.pembayaran.map(p => p.id === action.payload.id ? action.payload : p) };

    // Distribusi
    case 'SET_DISTRIBUSI': return { ...state, distribusi: action.payload };
    case 'ADD_DISTRIBUSI': return { ...state, distribusi: [...state.distribusi, action.payload] };
    case 'UPDATE_DISTRIBUSI': return { ...state, distribusi: state.distribusi.map(d => d.id === action.payload.id ? action.payload : d) };
    case 'DELETE_DISTRIBUSI': return { ...state, distribusi: state.distribusi.filter(d => d.id !== action.payload) };

    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Load from localStorage or use mock data
    const saved = localStorage.getItem('qurbanku_data');
    if (saved) {
      const data = JSON.parse(saved);
      dispatch({ type: 'SET_HEWAN', payload: data.hewan || mockHewan });
      dispatch({ type: 'SET_PESERTA', payload: data.peserta || mockPeserta });
      dispatch({ type: 'SET_PEMBAYARAN', payload: data.pembayaran || mockPembayaran });
      dispatch({ type: 'SET_DISTRIBUSI', payload: data.distribusi || mockDistribusi });
    } else {
      dispatch({ type: 'SET_HEWAN', payload: mockHewan });
      dispatch({ type: 'SET_PESERTA', payload: mockPeserta });
      dispatch({ type: 'SET_PEMBAYARAN', payload: mockPembayaran });
      dispatch({ type: 'SET_DISTRIBUSI', payload: mockDistribusi });
    }

    const savedAuth = localStorage.getItem('qurbanku_auth');
    if (savedAuth) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(savedAuth) });
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (state.hewan.length > 0) {
      localStorage.setItem('qurbanku_data', JSON.stringify({
        hewan: state.hewan,
        peserta: state.peserta,
        pembayaran: state.pembayaran,
        distribusi: state.distribusi,
      }));
    }
  }, [state.hewan, state.peserta, state.pembayaran, state.distribusi]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
