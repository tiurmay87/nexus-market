/**
 * ProductCard — displays a single product in the catalog grid
 * Props: product, onClick
 */
function ProductCard({ product, onClick }) {
  const [hov, setHov] = React.useState(false);

  const badgeColor =
    product.badge === 'New'
      ? '#10B981'
      : product.badge === 'Hot'
      ? '#EF4444'
      : '#6366F1';

  return React.createElement(
    'div',
    {
      onClick,
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hov ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hov
          ? '0 20px 60px rgba(0,0,0,0.12)'
          : '0 2px 12px rgba(0,0,0,0.06)',
        border: '1px solid #F1F5F9',
        display: 'flex',
        flexDirection: 'column',
      },
    },
    /* Image area */
    React.createElement(
      'div',
      {
        style: {
          background: 'linear-gradient(135deg,#F8FAFC,#EEF2FF)',
          padding: '32px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: '160px',
        },
      },
      product.badge &&
        React.createElement(
          'div',
          {
            style: {
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: badgeColor,
              color: 'white',
              padding: '4px 10px',
              borderRadius: '100px',
              fontSize: '11px',
              fontWeight: '700',
            },
          },
          product.badge
        ),
      React.createElement(
        'span',
        {
          style: {
            fontSize: '68px',
            transition: 'transform 0.3s',
            transform: hov ? 'scale(1.1)' : 'scale(1)',
          },
        },
        product.image
      )
    ),
    /* Content area */
    React.createElement(
      'div',
      { style: { padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' } },
      React.createElement(
        'div',
        {
          style: {
            fontSize: '11px',
            fontWeight: '700',
            color: '#6366F1',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '6px',
          },
        },
        product.company
      ),
      React.createElement(
        'h3',
        {
          style: {
            fontFamily: "'Playfair Display',serif",
            fontSize: '17px',
            fontWeight: '700',
            color: '#0F172A',
            margin: '0 0 8px',
            lineHeight: '1.3',
          },
        },
        product.name
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' } },
        React.createElement(StarRating, { rating: product.rating }),
        React.createElement(
          'span',
          { style: { fontSize: '12px', color: '#94A3B8' } },
          '(' + product.reviews.toLocaleString() + ')'
        )
      ),
      React.createElement(
        'div',
        { style: { marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
        React.createElement(
          'div',
          {
            style: {
              fontSize: '24px',
              fontWeight: '800',
              color: '#0F172A',
              fontFamily: "'Playfair Display',serif",
              letterSpacing: '-1px',
            },
          },
          fmt$(product.price)
        ),
        React.createElement(
          'div',
          {
            style: {
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: hov ? 'linear-gradient(135deg,#6366F1,#8B5CF6)' : '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'all 0.25s',
              color: hov ? 'white' : '#475569',
            },
          },
          '→'
        )
      )
    )
  );
}
