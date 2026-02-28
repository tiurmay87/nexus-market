/**
 * App — root component, manages routing between catalog / detail / checkout
 */
function App() {
  const [view,            setView]            = React.useState('catalog');
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [selectedCategory,setSelectedCategory]= React.useState('All');
  const [selectedCompany, setSelectedCompany] = React.useState('All');
  const [search,          setSearch]          = React.useState('');
  const [cart,            setCart]            = React.useState([]);
  const [cartOpen,        setCartOpen]        = React.useState(false);
  const [sortBy,          setSortBy]          = React.useState('popular');
  const [notif,           setNotif]           = React.useState(null);

  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 2500);
  };

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === product.id);
      if (ex) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...product, qty }];
    });
    showNotif('✓ ' + product.name + ' agregado al carrito');
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  /* Filter + sort products */
  let filtered = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedCompany  !== 'All' && p.company  !== selectedCompany)  return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  if (sortBy === 'price_asc')  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'rating')     filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const goCheckout = () => { setCartOpen(false); setView('checkout'); };
  const goCatalog  = () => { setView('catalog'); setSelectedProduct(null); setCart([]); };

  const h = React.createElement;

  return h(
    'div',
    { style: { minHeight: '100vh', background: '#FAFBFF', fontFamily: "'DM Sans','Segoe UI',sans-serif" } },

    /* Notification toast */
    notif &&
      h('div', {
        className: 'slide-in',
        style: { position: 'fixed', top: '80px', right: '24px', zIndex: 9999, background: '#0F172A', color: 'white', padding: '14px 20px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' },
      }, notif),

    /* ── HEADER ── */
    h(
      'header',
      {
        style: {
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid #E2E8F0', padding: '0 40px',
          display: 'flex', alignItems: 'center', gap: '24px',
          height: '68px', position: 'sticky', top: 0, zIndex: 1000,
        },
      },

      /* Logo */
      h('div', {
        onClick: () => { setView('catalog'); setSelectedProduct(null); },
        style: { cursor: 'pointer', flexShrink: 0 },
      },
        h('div', { style: { fontFamily: "'Playfair Display',serif", fontSize: '22px', fontWeight: '800', letterSpacing: '-1px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Nexus Market'),
        h('div', { style: { fontSize: '10px', letterSpacing: '2px', color: '#94A3B8', textTransform: 'uppercase', marginTop: '-2px' } }, 'Premium Tech Store')
      ),

      /* Search (catalog only) */
      view === 'catalog'
        ? h('div', { style: { flex: 1, maxWidth: '500px', position: 'relative' } },
            h('span', { style: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' } }, '🔍'),
            h('input', {
              value: search, onChange: (e) => setSearch(e.target.value),
              placeholder: 'Buscar productos, marcas...',
              style: { width: '100%', padding: '10px 14px 10px 42px', border: '2px solid #E2E8F0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', background: '#F8FAFF', outline: 'none', color: '#0F172A' },
            })
          )
        : h('div', { style: { flex: 1 } },
            h('span', { style: { display: 'inline-block', padding: '6px 14px', background: '#EEF2FF', borderRadius: '100px', fontSize: '13px', fontWeight: '600', color: '#6366F1' } }, '🔒 Proceso de pago seguro')
          ),

      /* Right actions */
      h(
        'div',
        { style: { marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' } },
        h('button', { style: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: '#475569' } }, '♡'),

        /* Cart button + dropdown */
        h('div', { style: { position: 'relative' } },
          h('button', {
            onClick: () => setCartOpen(!cartOpen),
            style: { background: cartCount > 0 ? 'linear-gradient(135deg,#6366F1,#8B5CF6)' : '#F1F5F9', border: 'none', borderRadius: '12px', padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: cartCount > 0 ? 'white' : '#475569', fontFamily: 'inherit' },
          },
            h('span', { style: { fontSize: '18px' } }, '🛒'),
            cartCount > 0 && h('span', { style: { fontWeight: '700', fontSize: '14px' } }, cartCount + ' · ' + fmt$(cartTotal))
          ),

          /* Cart dropdown */
          cartOpen &&
            h('div', {
              style: { position: 'absolute', top: 'calc(100% + 12px)', right: 0, zIndex: 999, background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '360px', border: '1px solid #E2E8F0' },
            },
              h('h3', { style: { fontFamily: "'Playfair Display',serif", fontSize: '20px', marginBottom: '16px', color: '#0F172A' } },
                'Carrito ' + (cartCount > 0 ? '(' + cartCount + ')' : '')
              ),
              cart.length === 0
                ? h('p', { style: { color: '#94A3B8', textAlign: 'center', padding: '24px 0' } }, 'Tu carrito está vacío')
                : h(
                    React.Fragment,
                    null,
                    cart.map((item) =>
                      h('div', { key: item.id, style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F1F5F9' } },
                        h('span', { style: { fontSize: '28px' } }, item.image),
                        h('div', { style: { flex: 1 } },
                          h('div', { style: { fontWeight: '600', fontSize: '13px', color: '#0F172A' } }, item.name),
                          h('div', { style: { color: '#94A3B8', fontSize: '12px' } }, 'x' + item.qty)
                        ),
                        h('div', { style: { fontWeight: '700', color: '#6366F1' } }, fmt$(item.price * item.qty))
                      )
                    ),
                    h('div', { style: { marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                      h('div', null,
                        h('div', { style: { fontSize: '12px', color: '#94A3B8' } }, 'Total'),
                        h('div', { style: { fontSize: '24px', fontWeight: '800', fontFamily: "'Playfair Display',serif", color: '#0F172A' } }, fmt$(cartTotal))
                      ),
                      h('button', {
                        onClick: goCheckout,
                        style: { background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' },
                      }, 'Checkout →')
                    )
                  )
            )
        )
      )
    ),

    /* ── MAIN CONTENT ── */
    h(
      'div',
      { style: { maxWidth: '1320px', margin: '0 auto', padding: '40px' } },

      view === 'checkout'
        ? h(CheckoutPage, { cart, onBack: () => setView('catalog'), onSuccess: goCatalog })

        : selectedProduct
        ? h(ProductDetail, { product: selectedProduct, onBack: () => setSelectedProduct(null), onAddToCart: addToCart })

        : h(
            React.Fragment,
            null,

            /* Hero banner */
            h('div', {
              style: { background: 'linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#A855F7 100%)', borderRadius: '28px', padding: '52px 56px', marginBottom: '40px', position: 'relative', overflow: 'hidden' },
            },
              h('div', { style: { position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', fontSize: '120px', opacity: 0.15, userSelect: 'none' } }, '🛍️'),
              h('div', { style: { fontSize: '12px', letterSpacing: '3px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '12px', fontWeight: '600' } }, 'Tech Marketplace'),
              h('h1', { style: { fontFamily: "'Playfair Display',serif", fontSize: '52px', fontWeight: '800', color: 'white', letterSpacing: '-2px', lineHeight: '1.1', marginBottom: '16px' } }, 'Los mejores productos del mercado'),
              h('p', { style: { color: 'rgba(255,255,255,0.75)', fontSize: '17px', maxWidth: '480px', lineHeight: '1.6' } }, 'Tecnología premium de las marcas más reconocidas. Envío gratis y garantía extendida.')
            ),

            /* Filters */
            h('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '32px' } },
              h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 } },
                categories.map((cat) =>
                  h('button', {
                    key: cat, onClick: () => setSelectedCategory(cat),
                    style: { padding: '8px 16px', borderRadius: '100px', border: '2px solid', borderColor: selectedCategory === cat ? '#6366F1' : '#E2E8F0', background: selectedCategory === cat ? '#6366F1' : 'white', color: selectedCategory === cat ? 'white' : '#475569', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' },
                  }, cat)
                )
              ),
              h('div', { style: { display: 'flex', gap: '8px' } },
                /* Company select */
                h('div', { style: { position: 'relative' } },
                  h('select', { value: selectedCompany, onChange: (e) => setSelectedCompany(e.target.value), style: { padding: '9px 32px 9px 14px', border: '2px solid #E2E8F0', borderRadius: '10px', background: 'white', fontSize: '13px', fontFamily: 'inherit', fontWeight: '600', color: '#475569', cursor: 'pointer', outline: 'none' } },
                    companies.map((c) => h('option', { key: c }, c))
                  ),
                  h('span', { style: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '10px' } }, '▼')
                ),
                /* Sort select */
                h('div', { style: { position: 'relative' } },
                  h('select', { value: sortBy, onChange: (e) => setSortBy(e.target.value), style: { padding: '9px 32px 9px 14px', border: '2px solid #E2E8F0', borderRadius: '10px', background: 'white', fontSize: '13px', fontFamily: 'inherit', fontWeight: '600', color: '#475569', cursor: 'pointer', outline: 'none' } },
                    [['popular', 'Más populares'], ['price_asc', 'Menor precio'], ['price_desc', 'Mayor precio'], ['rating', 'Mejor valorados']].map(([v, l]) => h('option', { key: v, value: v }, l))
                  ),
                  h('span', { style: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '10px' } }, '▼')
                )
              )
            ),

            h('div', { style: { fontSize: '14px', color: '#94A3B8', marginBottom: '24px', fontWeight: '500' } }, filtered.length + ' productos encontrados'),

            /* Product grid */
            h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '24px' } },
              filtered.map((p) => h(ProductCard, { key: p.id, product: p, onClick: () => setSelectedProduct(p) }))
            ),

            filtered.length === 0 &&
              h('div', { style: { textAlign: 'center', padding: '80px 0', color: '#94A3B8' } },
                h('div', { style: { fontSize: '48px', marginBottom: '16px' } }, '🔍'),
                h('div', { style: { fontSize: '18px', fontWeight: '600', color: '#475569' } }, 'No se encontraron productos'),
                h('div', { style: { marginTop: '8px' } }, 'Intenta con otros filtros')
              )
          )
    )
  );
}
