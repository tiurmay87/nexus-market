/**
 * ProductDetail — full product page with specs, qty selector and add-to-cart
 * Props: product, onBack, onAddToCart
 */
function ProductDetail({ product, onBack, onAddToCart }) {
  const [qty, setQty] = React.useState(1);

  const h = React.createElement;

  return h(
    'div',
    { className: 'slide-in' },

    /* Back button */
    h(
      'button',
      {
        onClick: onBack,
        style: {
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: 'none', color: '#6366F1',
          fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer',
          marginBottom: '28px', fontWeight: '600',
        },
      },
      '← Volver al catálogo'
    ),

    /* Two-column layout */
    h(
      'div',
      { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' } },

      /* LEFT — image */
      h(
        'div',
        {
          style: {
            background: 'linear-gradient(135deg,#F8FAFC,#EEF2FF)',
            borderRadius: '24px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', minHeight: '420px',
            position: 'relative', border: '1px solid #E2E8F0',
          },
        },
        product.badge &&
          h(
            'div',
            {
              style: {
                position: 'absolute', top: '20px', left: '20px',
                background: '#6366F1', color: 'white',
                padding: '6px 14px', borderRadius: '100px',
                fontSize: '12px', fontWeight: '700', textTransform: 'uppercase',
              },
            },
            product.badge
          ),
        h('span', { style: { fontSize: '130px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' } }, product.image)
      ),

      /* RIGHT — info */
      h(
        'div',
        null,

        /* Company badge */
        h(
          'div',
          {
            style: {
              display: 'inline-block', padding: '4px 12px', background: '#EEF2FF',
              borderRadius: '100px', fontSize: '12px', fontWeight: '700',
              color: '#6366F1', textTransform: 'uppercase', marginBottom: '12px',
            },
          },
          product.company
        ),

        /* Name */
        h(
          'h1',
          {
            style: {
              fontFamily: "'Playfair Display',serif", fontSize: '34px',
              fontWeight: '700', color: '#0F172A', margin: '0 0 12px',
              lineHeight: '1.15', letterSpacing: '-1px',
            },
          },
          product.name
        ),

        /* Rating */
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' } },
          h(StarRating, { rating: product.rating }),
          h('span', { style: { color: '#6366F1', fontWeight: '600', fontSize: '14px' } }, product.rating),
          h('span', { style: { color: '#94A3B8', fontSize: '14px' } }, '(' + product.reviews.toLocaleString() + ' reseñas)')
        ),

        /* Price */
        h(
          'div',
          {
            style: {
              fontSize: '40px', fontWeight: '800', color: '#0F172A',
              letterSpacing: '-2px', marginBottom: '20px',
              fontFamily: "'Playfair Display',serif",
            },
          },
          fmt$(product.price),
          h('span', { style: { fontSize: '16px', color: '#94A3B8', fontFamily: 'sans-serif', letterSpacing: 'normal', fontWeight: '400' } }, ' USD')
        ),

        /* Description */
        h('p', { style: { color: '#475569', lineHeight: '1.7', fontSize: '15px', marginBottom: '28px' } }, product.description),

        /* Specs */
        h(
          'div',
          { style: { marginBottom: '32px' } },
          h('h3', { style: { fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '12px' } }, 'Especificaciones'),
          product.specs.map((s, i) =>
            h(
              'div',
              { key: i, style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' } },
              h('div', { style: { width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1', flexShrink: 0 } }),
              h('span', { style: { color: '#334155', fontSize: '14px' } }, s)
            )
          )
        ),

        /* Qty + Add to cart */
        h(
          'div',
          { style: { display: 'flex', gap: '12px', alignItems: 'center' } },
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', border: '2px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' } },
            h('button', { onClick: () => setQty(Math.max(1, qty - 1)), style: { background: 'none', border: 'none', width: '44px', height: '44px', fontSize: '20px', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, '−'),
            h('span', { style: { width: '44px', textAlign: 'center', fontWeight: '700', fontSize: '16px', color: '#0F172A' } }, qty),
            h('button', { onClick: () => setQty(qty + 1), style: { background: 'none', border: 'none', width: '44px', height: '44px', fontSize: '20px', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, '+')
          ),
          h(
            'button',
            {
              onClick: () => onAddToCart(product, qty),
              style: {
                flex: 1, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                color: 'white', border: 'none', borderRadius: '12px',
                padding: '14px 24px', fontWeight: '700', fontSize: '15px',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
              },
            },
            '🛒 Agregar al carrito — ' + fmt$(product.price * qty)
          )
        ),

        /* Trust badges */
        h(
          'div',
          { style: { marginTop: '20px', padding: '14px 18px', background: '#F0FDF4', borderRadius: '12px', display: 'flex', gap: '20px' } },
          h('span', { style: { color: '#16A34A', fontSize: '13px', fontWeight: '600' } }, '✓ En stock'),
          h('span', { style: { color: '#16A34A', fontSize: '13px', fontWeight: '600' } }, '✓ Envío gratis'),
          h('span', { style: { color: '#16A34A', fontSize: '13px', fontWeight: '600' } }, '✓ Devol. 30 días')
        )
      )
    )
  );
}
