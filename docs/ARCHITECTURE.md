# Arquitectura técnica — Nexus Market

## Decisiones de diseño

### Sin build tools
El proyecto usa React directamente desde CDN con `React.createElement()` en lugar de JSX.
Esto permite abrir `index.html` en el navegador **sin necesitar Node.js, npm ni webpack**.

### Orden de carga de scripts
Los archivos JS se cargan en orden en `index.html`. Cada script expone sus funciones/variables
al scope global (`window`), lo que permite que los componentes se referencien entre sí:

```
products.js       → expone: products, categories, companies, banks
formatters.js     → expone: fmtCard, fmtExp, fmtDNI, fmt$, detectBrand, genPagoFacilCode, genOrderNum
StarRating.js     → expone: StarRating (función componente)
Field.js          → expone: Field
ProductCard.js    → expone: ProductCard  (usa: StarRating, fmt$)
ProductDetail.js  → expone: ProductDetail (usa: StarRating, fmt$)
CheckoutPage.js   → expone: CheckoutPage  (usa: Field, fmt$, banks, fmtCard, fmtExp, fmtDNI, detectBrand, genPagoFacilCode, genOrderNum)
App.js            → expone: App (usa: todos los componentes + data)
index.html        → monta: ReactDOM.createRoot → App
```

## Flujo de la aplicación

```
App (estado global)
 ├── view = 'catalog'
 │    ├── Hero Banner
 │    ├── Filtros (categoría, empresa, orden, búsqueda)
 │    └── Grid → ProductCard[]
 │                  └── onClick → view = 'detail'
 │
 ├── view = 'detail' (selectedProduct != null)
 │    └── ProductDetail
 │         └── onAddToCart → cart[]
 │
 └── view = 'checkout'
      └── CheckoutPage
           ├── Step 1: Shipping form
           ├── Step 2: Payment method
           │    ├── Tarjeta Crédito → CardForm + visual
           │    ├── Tarjeta Débito  → DebitForm + BankSelector + visual
           │    └── Pago Fácil      → DNI form + código generado
           └── Step 3: Success screen
```

## Estado

Todo el estado vive en `App`. Los componentes hijos son puros (reciben props, llaman callbacks).

| Estado | Tipo | Descripción |
|---|---|---|
| `view` | string | 'catalog' \| 'checkout' |
| `selectedProduct` | object\|null | Producto en detalle |
| `cart` | array | Items con qty |
| `selectedCategory` | string | Filtro activo |
| `selectedCompany` | string | Filtro activo |
| `search` | string | Búsqueda |
| `sortBy` | string | Orden activo |
| `cartOpen` | bool | Dropdown carrito |
| `notif` | string\|null | Toast notification |
