# Prohausen Propiedades - Frontend

Aplicación web de corredora de propiedades desarrollada con Next.js 15, React 19 y Tailwind CSS, integrada con WordPress + Estatik Plugin.

## 🚀 Características

- ✅ **Next.js 15** con App Router
- ✅ **React 19** (última versión)
- ✅ **TypeScript** para tipado estático
- ✅ **Tailwind CSS v4** para estilos
- ✅ **ESLint** configurado
- ✅ **Turbopack** para desarrollo rápido
- ✅ **Upstash Redis** para caché de propiedades
- ✅ **WordPress REST API** integración con Estatik
- ✅ **Google Maps** integración
- ✅ **Sistema de envío de emails** con API externa
- ✅ Diseño responsive y moderno
- ✅ Componentes reutilizables
- ✅ Panel de administración para gestión de caché

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
- Cuenta en Upstash Redis (para caché)
- WordPress con plugin Estatik configurado

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

\`\`\`bash

# WordPress API

NEXT_PUBLIC_WORDPRESS_API_URL=https://prohausen.cl/wp-json/wp/v2

# Upstash Redis (para caché de propiedades)

UPSTASH_REDIS_REST_URL=https://tu-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=tu_token_de_upstash

# Google Maps API Key

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key

# Panel de Administración

ADMIN_PASSWORD=admin2024
NEXT_PUBLIC_ADMIN_PASSWORD=admin2024
\`\`\`

### Instalación

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

## 🔐 Panel de Administración

### Acceso Local (Desarrollo)

- **URL**: [http://localhost:3000/admin/cache](http://localhost:3000/admin/cache)
- **Contraseña**: `admin2024` (por defecto)

### Acceso en Producción

-Url de producción: `https://prohausen-front.vercel.app/`

- Admin para actualizar cache de Redis: `https://prohausen-front.vercel.app/admin/cache`

### Funcionalidades del Panel

- ✅ Refrescar caché manualmente desde WordPress
- ✅ Ver información del caché (última actualización, cantidad de propiedades)
- ✅ Acceso protegido con contraseña
- ✅ Sincronización de propiedades destacadas

### ⚠️ Importante para Producción

- Cambia la contraseña usando las variables de entorno `ADMIN_PASSWORD` y `NEXT_PUBLIC_ADMIN_PASSWORD`
- Mantén seguras tus credenciales de Upstash Redis
- Configura restricciones de dominio en Google Maps API Key

## 📧 Sistema de Contacto

### Formulario de Contacto

- **Campos**: Nombre, Teléfono, Email, Comentario
- **API Endpoint**: `/api/send-contact-email`
- **Destino**: Configurable (actualmente: `victorhernandezvivanco75@gmail.com` para testing)

### Integración Email

- Utiliza API externa: `https://mails-api.kiracloud.dev/api/email/simple`
- HTML minimalista y responsive
- Manejo de errores y mensajes de éxito

## 🗺️ Integración con Google Maps

### Configuración

1. Obtén tu API Key de Google Cloud Console
2. Habilita las APIs: Maps JavaScript API, Places API
3. Configura restricciones de dominio:
   - Desarrollo: `http://localhost:3000/*`
   - Producción: `https://tu-dominio.com/*`

### Ubicación del Componente

- **Archivo**: `src/components/maps/GoogleMapComponent.tsx`
- **Uso**: Detalle de propiedades con marcador de ubicación

## 🔄 Arquitectura de Caché

### Flujo de Datos

```
WordPress (Estatik) → API REST → Upstash Redis → Next.js Frontend
```

### Actualización del Caché

1. Ve al panel de admin: `/admin/cache`
2. Ingresa la contraseña
3. Presiona "Refrescar Caché"
4. Las propiedades se sincronizan desde WordPress a Redis

### APIs Principales

| Endpoint                   | Método | Descripción                                |
| -------------------------- | ------ | ------------------------------------------ |
| `/api/featured-properties` | GET    | Obtiene propiedades destacadas desde Redis |
| `/api/all-properties`      | GET    | Obtiene todas las propiedades              |
| `/api/property/[id]`       | GET    | Obtiene una propiedad específica           |
| `/api/admin/refresh-cache` | POST   | Actualiza el caché desde WordPress         |
| `/api/admin/cache-info`    | GET    | Información del caché                      |
| `/api/send-contact-email`  | POST   | Envía formulario de contacto               |

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

## 🚀 Deployment

### Recomendaciones para Producción

#### **Vercel (Recomendado para Next.js)**

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno en el panel de Vercel
3. Deploy automático en cada push a `main`

#### **Netlify**

1. Conecta tu repositorio
2. Build command: `npm run build`
3. Publish directory: `.next`

#### **Servidor Propio (VPS/cPanel)**

1. Build: `npm run build`
2. Start: `npm run start` (requiere Node.js en el servidor)
3. Considera usar PM2 para mantener el proceso vivo

### Variables de Entorno en Producción

No olvides configurar todas las variables de entorno en tu plataforma de deployment:

- `NEXT_PUBLIC_WORDPRESS_API_URL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_ADMIN_PASSWORD`

## 🔧 Configuración de WordPress

### Plugin Estatik

El proyecto está integrado con el plugin **Estatik** de WordPress para gestión de propiedades.

### Meta Keys Necesarios en WordPress

Asegúrate de que WordPress exponga estos meta_keys en el REST API (editar `functions.php`):

- `es_property_area` (Área útil)
- `es_property_lot_size` (Área del terreno)
- `es_property_total_rooms` (Total de habitaciones)
- `es_property_n-de-piso` (Número de piso)
- `es_property_bathrooms` (Baños)
- `es_property_bedrooms` (Dormitorios)
- `es_property_video` (URL del video)
- `es_property_gallery` (Galería de imágenes)
- `latitude` y `longitude` (Coordenadas GPS)

## 📊 Propiedades Destacadas

### ¿Cómo se Muestran?

- El sistema filtra automáticamente las propiedades con `featured: true`
- No hay límite de propiedades destacadas (hasta 100 por defecto)
- Se muestran en un grid responsive (1-4 columnas según el tamaño de pantalla)

### ¿Cómo Agregar Más Destacadas?

1. En WordPress, marca la propiedad como "Destacada" en Estatik
2. Ve al panel de admin: `/admin/cache`
3. Presiona "Refrescar Caché"
4. Las nuevas propiedades destacadas aparecerán automáticamente

### Límite Configurable

Si necesitas más de 100 propiedades destacadas, edita:

- **Archivo**: `src/app/api/admin/refresh-cache/route.ts`
- **Línea 69**: Cambia `per_page=100` al número deseado

## 📄 Licencia

© 2025 Prohausen Propiedades. Todos los derechos reservados.

## 👨‍💻 Soporte y Contacto

Para consultas técnicas o soporte, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ usando Next.js 15 + React 19 + TypeScript**
