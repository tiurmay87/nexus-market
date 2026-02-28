# 🛍️ Nexus Market

**Premium Tech Marketplace** — un marketplace estilo Amazon construido con React vanilla (sin build tools), listo para deployar en cualquier servidor estático o GitHub Pages.

---

## 📸 Características

- 🗂️ **Catálogo de productos** con filtros por categoría y empresa, búsqueda en tiempo real y ordenamiento
- 🔍 **Vista de detalle** con especificaciones, selector de cantidad y añadir al carrito
- 🛒 **Carrito** con dropdown, resumen de ítems y total
- 💳 **Checkout multi-step** con 3 métodos de pago:
  - Tarjeta de Crédito (Visa, Mastercard, Amex) con tarjeta visual animada
  - Tarjeta de Débito con selector de banco
  - Pago Fácil — código de pago en efectivo
- ✅ **Pantalla de confirmación** con número de orden y código Pago Fácil

---

## 🗂️ Estructura del proyecto

```
nexus-market/
│
├── public/
│   ├── index.html        ← Punto de entrada (abrir en el navegador)
│   └── styles.css        ← Estilos globales, animaciones, responsive
│
├── src/
│   ├── data/
│   │   └── products.js   ← Array de productos, categorías, bancos
│   │
│   ├── utils/
│   │   └── formatters.js ← Helpers: fmtCard, fmtExp, fmt$, detectBrand…
│   │
│   └── components/
│       ├── StarRating.js   ← ★ Estrellas de rating
│       ├── Field.js        ← Input de formulario etiquetado
│       ├── ProductCard.js  ← Tarjeta de producto en el catálogo
│       ├── ProductDetail.js← Vista completa de un producto
│       ├── CheckoutPage.js ← Checkout 3 pasos + métodos de pago
│       └── App.js          ← Componente raíz, maneja el routing
│
├── docs/
│   └── ARCHITECTURE.md   ← Documentación técnica
│
└── README.md
```

---

## 🚀 Cómo usar

### Opción 1 — Abrir directo en el navegador

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/nexus-market.git
cd nexus-market

# Abrir el archivo HTML
open public/index.html        # macOS
start public/index.html       # Windows
xdg-open public/index.html    # Linux
```

> ⚠️ Algunos navegadores bloquean scripts locales por CORS. Si no carga, usá un servidor local (ver abajo).

### Opción 2 — Servidor local (recomendado para desarrollo)

```bash
# Con Python
cd nexus-market
python3 -m http.server 8080
# Abrir http://localhost:8080/public/

# Con Node.js (npx)
npx serve .
# Abrir la URL que indica la terminal
```

### Opción 3 — GitHub Pages

1. Subir el repo a GitHub
2. Ir a **Settings → Pages**
3. Source: **Deploy from a branch** → `main` → `/public`
4. Guardar — en unos minutos estará en `https://tu-usuario.github.io/nexus-market/`

---

## 🛠️ Stack técnico

| Tecnología | Uso |
|---|---|
| **React 18** | UI (via CDN, sin build tools) |
| **React DOM** | Renderizado en el navegador |
| **Vanilla JS** | Lógica, estado, utilidades |
| **CSS3** | Estilos, animaciones, grid |
| **Google Fonts** | Playfair Display + DM Sans |

**Sin dependencias de build** — no requiere Node.js, npm, webpack ni ningún transpilador. Los componentes usan `React.createElement()` directamente.

---

## 📦 Agregar productos

Editá `src/data/products.js` y añadí un objeto al array `products`:

```js
{
  id: 10,                          // único
  name: 'Nombre del producto',
  company: 'Empresa',
  category: 'Electronics',         // debe existir en el array categories
  price: 999,                      // en USD
  rating: 4.5,                     // 0–5
  reviews: 500,
  image: '🖨️',                    // emoji representativo
  badge: 'New',                    // 'New' | 'Hot' | 'Best Seller' | '' | cualquier texto
  description: 'Descripción...',
  specs: ['Spec 1', 'Spec 2'],     // array de strings
}
```

---

## 🎨 Personalización

### Cambiar colores
Los colores principales están en `public/styles.css` y como valores inline en los componentes. El color acento es `#6366F1` (indigo).

### Agregar métodos de pago
En `src/components/CheckoutPage.js`, editá el array `PAY_METHODS` y añadí el formulario correspondiente en el bloque `step === 2`.

### Cambiar la marca
- Nombre: buscar `Nexus Market` en `public/index.html` y `src/components/App.js`
- Subtítulo: `Premium Tech Store`

---

## 📄 Licencia

MIT — libre para uso personal y comercial.
"# nexus-market" 
