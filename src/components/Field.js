/**
 * Field — labeled form input
 * Props: label, placeholder, value, onChange, maxLength, type
 */
function Field({ label, placeholder, value, onChange, maxLength, type = 'text' }) {
  return React.createElement(
    'div',
    { style: { marginBottom: '16px' } },
    React.createElement(
      'label',
      {
        style: {
          display: 'block',
          fontSize: '11px',
          fontWeight: '700',
          color: '#64748B',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          marginBottom: '6px',
        },
      },
      label
    ),
    React.createElement('input', {
      type,
      value,
      onChange,
      placeholder,
      maxLength,
      style: {
        width: '100%',
        padding: '12px 14px',
        border: '2px solid #E2E8F0',
        borderRadius: '12px',
        fontSize: '15px',
        fontFamily: 'inherit',
        color: '#0F172A',
        background: '#FAFBFF',
        outline: 'none',
        boxSizing: 'border-box',
      },
    })
  );
}
