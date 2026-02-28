/**
 * CheckoutPage — multi-step checkout with shipping + payment methods
 * Methods: Tarjeta de Crédito, Tarjeta de Débito, Pago Fácil
 * Props: cart, onBack, onSuccess
 */
function CheckoutPage({ cart, onBack, onSuccess }) {
  const [step, setStep]         = React.useState(1);
  const [payMethod, setPayMethod] = React.useState(null);

  /* Shipping fields */
  const [nombre, setNombre] = React.useState('');
  const [email,  setEmail]  = React.useState('');
  const [dir,    setDir]    = React.useState('');
  const [ciudad, setCiudad] = React.useState('');
  const [cp,     setCp]     = React.useState('');

  /* Credit card fields */
  const [cNum,   setCNum]   = React.useState('');
  const [cName,  setCName]  = React.useState('');
  const [cExp,   setCExp]   = React.useState('');
  const [cCvv,   setCCvv]   = React.useState('');
  const [cBrand, setCBrand] = React.useState('visa');

  /* Debit card fields */
  const [dNum,  setDNum]  = React.useState('');
  const [dName, setDName] = React.useState('');
  const [dExp,  setDExp]  = React.useState('');
  const [dPin,  setDPin]  = React.useState('');
  const [dBank, setDBank] = React.useState('galicia');

  /* Pago Fácil fields */
  const [pfDni, setPfDni] = React.useState('');
  const [pfNom, setPfNom] = React.useState('');
  const [pfCode]          = React.useState(genPagoFacilCode);
  const [orderNum]        = React.useState(genOrderNum);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const PAY_METHODS = [
    { id: 'credito',   label: 'Tarjeta de Crédito', icon: '💳', desc: 'Visa, Mastercard, Amex',        accent: '#6366F1', bg: '#EEF2FF' },
    { id: 'debito',    label: 'Tarjeta de Débito',  icon: '🏦', desc: 'Débito bancario inmediato',      accent: '#10B981', bg: '#ECFDF5' },
    { id: 'pagofacil', label: 'Pago Fácil',         icon: '🏪', desc: 'Efectivo en sucursales del país',accent: '#F59E0B', bg: '#FFFBEB' },
  ];

  const handleCNum = (v) => {
    const f = fmtCard(v);
    setCNum(f);
    setCBrand(detectBrand(f));
  };

  /* Validation */
  const ok1 = nombre && email && dir && ciudad && cp;
  const ok2 = payMethod && (
    payMethod === 'pagofacil' ? pfDni && pfNom :
    payMethod === 'credito'   ? cNum.length >= 19 && cName && cExp.length === 5 && cCvv.length >= 3 :
    dNum.length >= 19 && dName && dExp.length === 5 && dPin.length >= 4
  );

  const brandLabel = { visa: 'VISA', mastercard: 'MC', amex: 'AMEX' };

  const h = React.createElement;

  /* ── Step indicator bar ── */
  function StepBar() {
    const steps = [{ n: 1, l: 'Datos' }, { n: 2, l: 'Pago' }, { n: 3, l: 'Confirmado' }];
    return h(
      'div',
      { style: { display: 'flex', alignItems: 'center', marginBottom: '36px' } },
      steps.map((s, i) =>
        h(
          React.Fragment,
          { key: s.n },
          h(
            'div',
            { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' } },
            h(
              'div',
              {
                style: {
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: step >= s.n ? 'linear-gradient(135deg,#6366F1,#8B5CF6)' : '#E2E8F0',
                  color: step >= s.n ? 'white' : '#94A3B8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '800', fontSize: '14px',
                },
              },
              step > s.n ? '✓' : s.n
            ),
            h('span', { style: { fontSize: '11px', fontWeight: '600', color: step >= s.n ? '#6366F1' : '#94A3B8' } }, s.l)
          ),
          i < steps.length - 1 &&
            h('div', {
              style: {
                flex: 1, height: '2px',
                background: step > s.n ? '#6366F1' : '#E2E8F0',
                margin: '0 8px', marginBottom: '20px',
              },
            })
        )
      )
    );
  }

  /* ── Order summary sidebar ── */
  function Summary() {
    return h(
      'div',
      { style: { background: '#F8FAFF', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0', position: 'sticky', top: '88px' } },
      h('h3', { style: { fontFamily: "'Playfair Display',serif", fontSize: '20px', color: '#0F172A', marginBottom: '20px' } }, 'Resumen del pedido'),
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' } },
        cart.map((item) =>
          h(
            'div',
            { key: item.id, style: { display: 'flex', alignItems: 'center', gap: '10px' } },
            h('div', { style: { width: '44px', height: '44px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', border: '1px solid #E2E8F0', flexShrink: 0 } }, item.image),
            h('div', { style: { flex: 1, minWidth: 0 } },
              h('div', { style: { fontWeight: '600', fontSize: '13px', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, item.name),
              h('div', { style: { fontSize: '12px', color: '#94A3B8' } }, 'x' + item.qty)
            ),
            h('div', { style: { fontWeight: '700', color: '#0F172A', fontSize: '13px', flexShrink: 0 } }, fmt$(item.price * item.qty))
          )
        )
      ),
      h(
        'div',
        { style: { borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' } },
        h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748B' } },
          h('span', null, 'Subtotal'), h('span', null, fmt$(total))),
        h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#10B981', fontWeight: '600' } },
          h('span', null, 'Envío'), h('span', null, 'Gratis')),
        h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontWeight: '800', color: '#0F172A', fontFamily: "'Playfair Display',serif", marginTop: '6px' } },
          h('span', null, 'Total'), h('span', null, fmt$(total)))
      ),
      h('div', { style: { marginTop: '16px', padding: '10px 14px', background: '#EEF2FF', borderRadius: '10px', fontSize: '12px', color: '#6366F1', fontWeight: '600' } },
        '🔒 Pago 100% seguro y encriptado')
    );
  }

  /* ── STEP 3 — Success screen ── */
  if (step === 3) {
    const pm = PAY_METHODS.find((m) => m.id === payMethod);
    return h(
      'div',
      { className: 'slide-in', style: { maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '60px 20px' } },
      h('div', { style: { fontSize: '80px', marginBottom: '24px' } }, '🎉'),
      h('h1', { style: { fontFamily: "'Playfair Display',serif", fontSize: '36px', color: '#0F172A', marginBottom: '12px', letterSpacing: '-1px' } }, '¡Pedido confirmado!'),
      h('p', { style: { color: '#64748B', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' } }, 'Gracias ', h('strong', null, nombre), '. Tu pedido fue procesado exitosamente.'),
      h(
        'div',
        { style: { background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0', marginBottom: '24px', textAlign: 'left' } },
        h('h3', { style: { fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '16px' } }, 'Detalles del pedido'),
        [
          ['Nro. de orden', orderNum],
          ['Método de pago', pm?.label],
          ['Envío a', dir + ', ' + ciudad + ' (' + cp + ')'],
          ['Email', email],
          ['Total pagado', fmt$(total)],
        ].map(([k, v]) =>
          h('div', { key: k, style: { display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F1F5F9' } },
            h('span', { style: { color: '#94A3B8', fontSize: '14px' } }, k),
            h('span', { style: { color: '#0F172A', fontWeight: '600', fontSize: '14px', textAlign: 'right' } }, v)
          )
        )
      ),
      payMethod === 'pagofacil' &&
        h(
          'div',
          { style: { background: '#FFFBEB', borderRadius: '16px', padding: '24px', border: '2px solid #F59E0B', marginBottom: '24px', textAlign: 'left' } },
          h('div', { style: { fontWeight: '700', color: '#92400E', marginBottom: '8px', fontSize: '15px' } }, '📄 Código de pago Pago Fácil'),
          h('div', { style: { fontSize: '36px', fontWeight: '800', letterSpacing: '6px', color: '#D97706', fontFamily: 'monospace', textAlign: 'center', padding: '12px 0' } }, pfCode),
          h('div', { style: { fontSize: '13px', color: '#92400E', textAlign: 'center' } }, 'Presentá este código en cualquier sucursal Pago Fácil. Válido por 48hs.')
        ),
      h(
        'button',
        {
          onClick: onSuccess,
          style: { background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', border: 'none', borderRadius: '14px', padding: '16px 36px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 24px rgba(99,102,241,0.35)' },
        },
        'Seguir comprando →'
      )
    );
  }

  /* ── Steps 1 & 2 ── */
  return h(
    'div',
    { className: 'slide-in' },
    h('button', { onClick: onBack, style: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#6366F1', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', marginBottom: '28px', fontWeight: '600' } }, '← Volver al carrito'),
    h('h1', { style: { fontFamily: "'Playfair Display',serif", fontSize: '36px', fontWeight: '800', color: '#0F172A', letterSpacing: '-1.5px', marginBottom: '6px' } }, 'Checkout'),
    h('p', { style: { color: '#94A3B8', marginBottom: '32px', fontSize: '15px' } }, 'Completá los datos para finalizar tu compra'),
    h(StepBar, null),

    h(
      'div',
      { style: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'start' } },

      /* LEFT column */
      h(
        'div',
        null,

        /* ── STEP 1: Shipping ── */
        step === 1 &&
          h(
            'div',
            { className: 'slide-in' },
            h(
              'div',
              { style: { background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #E2E8F0', marginBottom: '20px' } },
              h('h2', { style: { fontFamily: "'Playfair Display',serif", fontSize: '22px', color: '#0F172A', marginBottom: '24px' } }, '📋 Datos personales'),
              h(Field, { label: 'Nombre completo', placeholder: 'Juan Pérez', value: nombre, onChange: (e) => setNombre(e.target.value) }),
              h(Field, { label: 'Correo electrónico', placeholder: 'juan@email.com', type: 'email', value: email, onChange: (e) => setEmail(e.target.value) })
            ),
            h(
              'div',
              { style: { background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #E2E8F0' } },
              h('h2', { style: { fontFamily: "'Playfair Display',serif", fontSize: '22px', color: '#0F172A', marginBottom: '24px' } }, '📦 Dirección de envío'),
              h(Field, { label: 'Dirección', placeholder: 'Av. Corrientes 1234, Piso 3B', value: dir, onChange: (e) => setDir(e.target.value) }),
              h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' } },
                h(Field, { label: 'Ciudad / Localidad', placeholder: 'Buenos Aires', value: ciudad, onChange: (e) => setCiudad(e.target.value) }),
                h(Field, { label: 'Código Postal', placeholder: 'C1043', value: cp, onChange: (e) => setCp(e.target.value), maxLength: 8 })
              )
            ),
            h('button', {
              disabled: !ok1, onClick: () => setStep(2),
              style: { marginTop: '24px', width: '100%', padding: '16px', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '16px', cursor: ok1 ? 'pointer' : 'not-allowed', fontFamily: 'inherit', background: ok1 ? 'linear-gradient(135deg,#6366F1,#8B5CF6)' : '#E2E8F0', color: ok1 ? 'white' : '#94A3B8', boxShadow: ok1 ? '0 4px 24px rgba(99,102,241,0.3)' : 'none' },
            }, 'Continuar al pago →')
          ),

        /* ── STEP 2: Payment ── */
        step === 2 &&
          h(
            'div',
            { className: 'slide-in' },

            /* Method picker */
            h(
              'div',
              { style: { background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #E2E8F0', marginBottom: '20px' } },
              h('h2', { style: { fontFamily: "'Playfair Display',serif", fontSize: '22px', color: '#0F172A', marginBottom: '24px' } }, '💰 Elegí tu método de pago'),
              h(
                'div',
                { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
                PAY_METHODS.map((m) =>
                  h(
                    'button',
                    {
                      key: m.id, onClick: () => setPayMethod(m.id),
                      style: { display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', border: '2px solid', borderColor: payMethod === m.id ? m.accent : '#E2E8F0', borderRadius: '16px', background: payMethod === m.id ? m.bg : 'white', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.2s' },
                    },
                    h('div', { style: { width: '48px', height: '48px', borderRadius: '12px', background: m.accent + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 } }, m.icon),
                    h('div', { style: { flex: 1 } },
                      h('div', { style: { fontWeight: '700', color: '#0F172A', fontSize: '15px' } }, m.label),
                      h('div', { style: { color: '#94A3B8', fontSize: '13px' } }, m.desc)
                    ),
                    h('div', {
                      style: { width: '22px', height: '22px', borderRadius: '50%', border: '2px solid', borderColor: payMethod === m.id ? m.accent : '#CBD5E1', background: payMethod === m.id ? m.accent : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
                    },
                      payMethod === m.id && h('div', { style: { width: '8px', height: '8px', borderRadius: '50%', background: 'white' } })
                    )
                  )
                )
              )
            ),

            /* ── Credit card form ── */
            payMethod === 'credito' &&
              h(
                'div',
                { className: 'slide-in', style: { background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #E2E8F0' } },
                h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' } },
                  h('h3', { style: { fontFamily: "'Playfair Display',serif", fontSize: '20px', color: '#0F172A' } }, 'Datos de la tarjeta'),
                  h('div', { style: { display: 'flex', gap: '6px' } },
                    ['visa', 'mastercard', 'amex'].map((b) =>
                      h('div', { key: b, style: { padding: '4px 10px', borderRadius: '8px', border: '2px solid', borderColor: cBrand === b ? '#6366F1' : '#E2E8F0', background: cBrand === b ? '#EEF2FF' : 'white', fontSize: '11px', fontWeight: '800', color: cBrand === b ? '#6366F1' : '#94A3B8' } },
                        b === 'visa' ? 'VISA' : b === 'mastercard' ? 'MC' : 'AMEX')
                    )
                  )
                ),
                /* Card visual */
                h('div', { style: { background: 'linear-gradient(135deg,#6366F1 0%,#8B5CF6 60%,#A855F7 100%)', borderRadius: '18px', padding: '28px', marginBottom: '24px', position: 'relative', overflow: 'hidden', minHeight: '170px', boxShadow: '0 12px 40px rgba(99,102,241,0.4)' } },
                  h('div', { style: { position: 'absolute', top: '-30px', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' } }),
                  h('div', { style: { position: 'relative', zIndex: 1 } },
                    h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '24px' } },
                      h('span', { style: { fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' } }, 'NEXUS MARKET'),
                      h('span', { style: { fontWeight: '800', color: 'white', fontSize: '14px', letterSpacing: '1px' } }, brandLabel[cBrand])
                    ),
                    h('div', { style: { fontSize: '20px', fontWeight: '700', color: 'white', letterSpacing: '3px', fontFamily: 'monospace', marginBottom: '20px' } }, cNum || '•••• •••• •••• ••••'),
                    h('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                      h('div', null,
                        h('div', { style: { fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', marginBottom: '2px' } }, 'TITULAR'),
                        h('div', { style: { color: 'white', fontWeight: '600', fontSize: '14px' } }, cName || 'NOMBRE APELLIDO')
                      ),
                      h('div', { style: { textAlign: 'right' } },
                        h('div', { style: { fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', marginBottom: '2px' } }, 'VENCE'),
                        h('div', { style: { color: 'white', fontWeight: '600', fontSize: '14px' } }, cExp || 'MM/AA')
                      )
                    )
                  )
                ),
                h(Field, { label: 'Número de tarjeta', placeholder: '1234 5678 9012 3456', value: cNum, onChange: (e) => handleCNum(e.target.value), maxLength: 19 }),
                h(Field, { label: 'Nombre del titular', placeholder: 'JUAN PÉREZ', value: cName, onChange: (e) => setCName(e.target.value.toUpperCase()) }),
                h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' } },
                  h(Field, { label: 'Vencimiento', placeholder: 'MM/AA', value: cExp, onChange: (e) => setCExp(fmtExp(e.target.value)), maxLength: 5 }),
                  h(Field, { label: 'CVV / CVC', placeholder: '123', value: cCvv, onChange: (e) => setCCvv(e.target.value.replace(/\D/g, '').slice(0, 4)) })
                ),
                h('div', { style: { padding: '12px 14px', background: '#F0FDF4', borderRadius: '10px', fontSize: '13px', color: '#16A34A', fontWeight: '600' } }, '🔒 Encriptación SSL 256 bits · Datos protegidos')
              ),

            /* ── Debit card form ── */
            payMethod === 'debito' &&
              h(
                'div',
                { className: 'slide-in', style: { background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #E2E8F0' } },
                h('h3', { style: { fontFamily: "'Playfair Display',serif", fontSize: '20px', color: '#0F172A', marginBottom: '24px' } }, 'Tarjeta de débito'),
                h('div', { style: { marginBottom: '16px' } },
                  h('label', { style: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px' } }, 'Banco emisor'),
                  h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' } },
                    banks.map((b) =>
                      h('button', { key: b.id, onClick: () => setDBank(b.id), style: { padding: '10px 8px', border: '2px solid', borderColor: dBank === b.id ? '#10B981' : '#E2E8F0', borderRadius: '10px', background: dBank === b.id ? '#F0FDF4' : 'white', color: dBank === b.id ? '#059669' : '#475569', fontWeight: '600', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' } }, b.label)
                    )
                  )
                ),
                /* Debit card visual */
                h('div', { style: { background: 'linear-gradient(135deg,#059669 0%,#10B981 60%,#34D399 100%)', borderRadius: '18px', padding: '28px', marginBottom: '24px', position: 'relative', overflow: 'hidden', minHeight: '170px', boxShadow: '0 12px 40px rgba(16,185,129,0.4)' } },
                  h('div', { style: { position: 'absolute', top: '-30px', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' } }),
                  h('div', { style: { position: 'relative', zIndex: 1 } },
                    h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '24px' } },
                      h('span', { style: { fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '700' } }, banks.find((b) => b.id === dBank)?.label),
                      h('span', { style: { fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' } }, 'DÉBITO')
                    ),
                    h('div', { style: { fontSize: '20px', fontWeight: '700', color: 'white', letterSpacing: '3px', fontFamily: 'monospace', marginBottom: '20px' } }, dNum || '•••• •••• •••• ••••'),
                    h('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                      h('div', null,
                        h('div', { style: { fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', marginBottom: '2px' } }, 'TITULAR'),
                        h('div', { style: { color: 'white', fontWeight: '600', fontSize: '14px' } }, dName || 'NOMBRE APELLIDO')
                      ),
                      h('div', { style: { textAlign: 'right' } },
                        h('div', { style: { fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', marginBottom: '2px' } }, 'VENCE'),
                        h('div', { style: { color: 'white', fontWeight: '600', fontSize: '14px' } }, dExp || 'MM/AA')
                      )
                    )
                  )
                ),
                h(Field, { label: 'Número de tarjeta', placeholder: '1234 5678 9012 3456', value: dNum, onChange: (e) => setDNum(fmtCard(e.target.value)), maxLength: 19 }),
                h(Field, { label: 'Nombre del titular', placeholder: 'JUAN PÉREZ', value: dName, onChange: (e) => setDName(e.target.value.toUpperCase()) }),
                h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' } },
                  h(Field, { label: 'Vencimiento', placeholder: 'MM/AA', value: dExp, onChange: (e) => setDExp(fmtExp(e.target.value)), maxLength: 5 }),
                  h(Field, { label: 'PIN (4 dígitos)', placeholder: '••••', type: 'password', value: dPin, onChange: (e) => setDPin(e.target.value.replace(/\D/g, '').slice(0, 4)) })
                ),
                h('div', { style: { padding: '12px 14px', background: '#F0FDF4', borderRadius: '10px', fontSize: '13px', color: '#16A34A', fontWeight: '600' } }, '🏦 El débito se acredita en tiempo real desde tu cuenta bancaria')
              ),

            /* ── Pago Fácil form ── */
            payMethod === 'pagofacil' &&
              h(
                'div',
                { className: 'slide-in', style: { background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #E2E8F0' } },
                h('h3', { style: { fontFamily: "'Playfair Display',serif", fontSize: '20px', color: '#0F172A', marginBottom: '8px' } }, 'Pago en efectivo — Pago Fácil'),
                h('p', { style: { color: '#64748B', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' } }, 'Completá tus datos y recibís un código para abonar en efectivo en cualquier sucursal Pago Fácil del país.'),
                h('div', { style: { background: 'linear-gradient(135deg,#F59E0B,#FBBF24)', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' } },
                  h('span', { style: { fontSize: '40px' } }, '🏪'),
                  h('div', null,
                    h('div', { style: { fontWeight: '800', color: 'white', fontSize: '18px' } }, 'Pago Fácil'),
                    h('div', { style: { color: 'rgba(255,255,255,0.85)', fontSize: '13px' } }, '+5.000 sucursales · Sin tarjeta · Pago en efectivo')
                  )
                ),
                h(Field, { label: 'Nombre completo', placeholder: 'Juan Pérez', value: pfNom, onChange: (e) => setPfNom(e.target.value) }),
                h(Field, { label: 'DNI', placeholder: '12345678', value: pfDni, onChange: (e) => setPfDni(fmtDNI(e.target.value)), maxLength: 8 }),
                h('div', { style: { padding: '20px', background: '#FFFBEB', borderRadius: '14px', border: '2px dashed #F59E0B', marginBottom: '20px' } },
                  h('div', { style: { fontSize: '11px', fontWeight: '700', color: '#92400E', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' } }, 'Tu código de pago'),
                  h('div', { style: { fontSize: '34px', fontWeight: '800', letterSpacing: '5px', color: '#D97706', fontFamily: 'monospace' } }, pfCode),
                  h('div', { style: { fontSize: '12px', color: '#92400E', marginTop: '6px' } }, 'Se generará al confirmar. Válido por 48 horas.')
                ),
                h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
                  ['Presentá el código en cualquier sucursal Pago Fácil', 'Abonás el monto total en efectivo', 'Recibís confirmación automática por email'].map((t, i) =>
                    h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: '10px' } },
                      h('div', { style: { width: '24px', height: '24px', borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: 'white', flexShrink: 0 } }, i + 1),
                      h('span', { style: { fontSize: '13px', color: '#475569' } }, t)
                    )
                  )
                )
              ),

            /* Back / Confirm buttons */
            h(
              'div',
              { style: { display: 'flex', gap: '12px', marginTop: '24px' } },
              h('button', { onClick: () => setStep(1), style: { padding: '16px 24px', background: 'white', border: '2px solid #E2E8F0', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', color: '#475569', fontSize: '15px' } }, '← Atrás'),
              h('button', {
                disabled: !ok2, onClick: () => setStep(3),
                style: { flex: 1, padding: '16px', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '16px', cursor: ok2 ? 'pointer' : 'not-allowed', fontFamily: 'inherit', background: ok2 ? 'linear-gradient(135deg,#6366F1,#8B5CF6)' : '#E2E8F0', color: ok2 ? 'white' : '#94A3B8', boxShadow: ok2 ? '0 4px 24px rgba(99,102,241,0.3)' : 'none' },
              },
                (payMethod === 'pagofacil' ? '🏪 Generar código Pago Fácil' : '🔒 Confirmar pago') + ' — ' + fmt$(total)
              )
            )
          )
      ),

      /* RIGHT — Summary */
      h(Summary, null)
    )
  );
}
