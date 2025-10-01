# Prohausen Propiedades - Frontend

Aplicación web de corredora de propiedades desarrollada con Next.js 15, React 19 y Tailwind CSS.

## 🚀 Características

- ✅ **Next.js 15** con App Router
- ✅ **React 19** (última versión)
- ✅ **TypeScript** para tipado estático
- ✅ **Tailwind CSS v4** para estilos
- ✅ **ESLint** configurado
- ✅ **Turbopack** para desarrollo rápido
- ✅ Diseño responsive y moderno
- ✅ Componentes reutilizables

## 📁 Estructura del Proyecto

```
prohausen_front/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página de inicio
│   │   ├── propiedades/
│   │   │   └── page.tsx          # Listado de propiedades
│   │   ├── servicios/
│   │   │   └── page.tsx          # Página de servicios
│   │   ├── contacto/
│   │   │   └── page.tsx          # Formulario de contacto
│   │   ├── layout.tsx            # Layout principal
│   │   └── globals.css           # Estilos globales
│   └── components/
│       ├── layout/
│       │   ├── Navbar.tsx        # Barra de navegación
│       │   └── Footer.tsx        # Pie de página
│       ├── home/
│       │   ├── SearchHero.tsx    # Hero con buscador
│       │   ├── FeaturedProperties.tsx
│       │   ├── ServicesPreview.tsx
│       │   └── ContactCTA.tsx
│       └── properties/
│           ├── PropertyCard.tsx   # Tarjeta de propiedad
│           └── PropertyFilters.tsx # Filtros de búsqueda
├── public/                        # Archivos estáticos
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 🎨 Páginas Implementadas

### 1. **Inicio** (`/`)
- Hero section con buscador de propiedades
- Propiedades destacadas
- Preview de servicios
- Call-to-action de contacto

### 2. **Propiedades** (`/propiedades`)
- Listado completo de propiedades
- Filtros por: operación, categoría, región y comuna
- Ordenamiento: más nuevo, precio bajo/alto
- Contador de resultados
- Grid responsive

### 3. **Servicios** (`/servicios`)
- Venta de propiedades
- Arriendo
- Administración
- Características de cada servicio
- Sección "¿Por qué elegirnos?"

### 4. **Contacto** (`/contacto`)
- Formulario de contacto completo
- Validación de campos
- Información de contacto
- Horarios de atención

## 🛠️ Instalación y Uso

### Requisitos previos
- Node.js 20+ instalado
- npm o yarn

### Instalación
Las dependencias ya están instaladas. Si necesitas reinstalarlas:

\`\`\`bash
npm install
\`\`\`

### Desarrollo

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Build para producción

\`\`\`bash
npm run build
npm run start
\`\`\`

### Linting

\`\`\`bash
npm run lint
\`\`\`

## 🎨 Componentes Principales

### Layout Components
- **Navbar**: Navegación responsive con menú móvil
- **Footer**: Información de contacto y enlaces rápidos

### Home Components
- **SearchHero**: Buscador con filtros (operación, categoría, región, comuna)
- **FeaturedProperties**: Muestra propiedades destacadas
- **ServicesPreview**: Preview de los servicios ofrecidos
- **ContactCTA**: Call-to-action para contacto

### Property Components
- **PropertyCard**: Tarjeta de propiedad con imagen, detalles y precio
- **PropertyFilters**: Panel de filtros colapsable

## 🔄 Próximos Pasos (Integración Backend)

- [ ] Conectar API de propiedades
- [ ] Implementar autenticación de usuarios
- [ ] Sistema de favoritos
- [ ] Galería de imágenes completa
- [ ] Detalle individual de propiedades
- [ ] Integración con formularios de contacto
- [ ] Panel de administración
- [ ] Carga de imágenes
- [ ] Sistema de reservas/citas

## 🎨 Paleta de Colores

- **Primario**: Blue 900 (#1e3a8a)
- **Secundario**: Blue 700 (#1d4ed8)
- **Acento**: Yellow 500 (destacados)
- **Texto**: Gray 900, Gray 600
- **Fondo**: Gray 50, White

## 📱 Responsive Design

El diseño es completamente responsive con breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🤝 Contribución

Este es un proyecto privado para Prohausen Propiedades.

## 📄 Licencia

© 2025 Prohausen Propiedades. Todos los derechos reservados.

---

**Desarrollado con ❤️ usando Next.js**
