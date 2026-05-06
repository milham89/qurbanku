/**
 * NumberInput — Input angka dengan format titik ribuan otomatis (Indonesia)
 * Contoh: ketik 18000000 → tampil 18.000.000
 *
 * Props:
 *   value     : string/number — nilai mentah (tanpa titik), disimpan di state
 *   onChange  : (rawValue: string) => void — dipanggil dengan nilai tanpa titik
 *   prefix    : string — misal "Rp " (opsional)
 *   placeholder: string
 *   className : string
 */
export default function NumberInput({ value, onChange, prefix = '', placeholder = '0', className = 'input', ...rest }) {
  // Format angka mentah → tampilan dengan titik
  function formatDisplay(raw) {
    const digits = String(raw || '').replace(/\D/g, '');
    if (!digits) return '';
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Saat user mengetik
  function handleChange(e) {
    // Ambil hanya digit dari input
    const raw = e.target.value.replace(/\D/g, '');
    onChange(raw); // kirim nilai mentah ke parent
  }

  const displayValue = formatDisplay(value);

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {prefix && (
        <span style={{
          position: 'absolute',
          left: '12px',
          color: 'var(--text-muted)',
          fontSize: '14px',
          fontWeight: 500,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {prefix}
        </span>
      )}
      <input
        {...rest}
        type="text"
        inputMode="numeric"
        className={className}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        style={{ paddingLeft: prefix ? `calc(12px + ${prefix.length * 8}px)` : undefined, ...rest.style }}
      />
    </div>
  );
}
