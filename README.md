# Prohausen Propiedades - Frontend

Aplicación web de corredora de propiedades desarrollada con Next.js 15, React 19 y Tailwind CSS, integrada con WordPress + Estatik Plugin.

## 🚀 Características

- ✅ **Next.js 15** con App Router
- ✅ **React 19** (última versión)
- ✅ **TypeScript** para tipado estático
- ✅ **Tailwind CSS v4** para estilos
- ✅ **ESLint** configurado
- ✅ **Turbopack** para desarrollo rápido
- ✅ **MongoDB Atlas** para almacenamiento de datos
- ✅ **AWS S3** para almacenamiento de imágenes
- ✅ **Google Maps** integración
- ✅ **Sistema de envío de emails** con API externa
- ✅ Diseño responsive y moderno
- ✅ Componentes reutilizables
- ✅ Panel de administración con CRUD completo
- ✅ **Fuente Poppins** integrada con optimización de `next/font`
- ✅ **Paginación** de 12 propiedades por página
- ✅ **Filtros avanzados** con dropdown posicionado junto a "Ordenar por"

## ✨ Últimas Mejoras (Octubre 2025)

### UI/UX
- 🎨 **Títulos centrados**: "Propiedades Destacadas" y "Propiedades" ahora están centrados
- 🎨 **Botones unificados**: Todos los botones principales usan el mismo azul (`bg-blue-900`)
- 🖱️ **Cursor mejorado**: `cursor-pointer` en todas las cards de propiedades, incluyendo imágenes del carrusel
- 📏 **Paginación actualizada**: Ahora se muestran 12 propiedades por página (antes 10)

### Funcionalidad
- 🔍 **Filtros reubicados**: El botón de filtros se movió al lado de "Ordenar por" con dropdown absoluto
- 📧 **Formulario de contacto simplificado**: Se eliminaron los campos de renta (Renta Promedio, ¿Complementas renta?, Renta Promedio Codeudor)
- 💬 **Integración de email**: El formulario envía correos a través de la API externa de Kira Cloud
- 🏠 **Propiedades destacadas dinámicas**: Sistema automático que muestra todas las propiedades con `featured=true`

### Performance
- ⚡ **MongoDB Atlas**: Base de datos en la nube para gestión de propiedades
- 🖼️ **AWS S3**: Almacenamiento de imágenes optimizado
- 🔄 **Panel de admin**: CRUD completo desde `/admin/properties`
- 🗺️ **Google Maps optimizado**: Integración con API Key configurada para producción y desarrollo

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
- Cuenta en MongoDB Atlas
- Bucket de AWS S3 configurado

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

\`\`\`bash

# MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/prohausen?retryWrites=true&w=majority

# AWS S3
AWS_ACCESS_KEY_ID=tu_access_key_id
AWS_SECRET_ACCESS_KEY=tu_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=prohausen-properties

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

- **URL**: [http://localhost:3000/admin/properties](http://localhost:3000/admin/properties)
- **Contraseña**: `admin2024` (por defecto)

### Acceso en Producción

- URL de producción: `https://prohausen-front.vercel.app/`
- Admin CRUD de propiedades: `https://prohausen-front.vercel.app/admin/properties`

### Funcionalidades del Panel

- ✅ Crear nuevas propiedades con formulario completo
- ✅ Editar propiedades existentes
- ✅ Eliminar propiedades (con confirmación)
- ✅ Gestión de imágenes (upload múltiple a S3)
- ✅ Listado con búsqueda y filtros
- ✅ Acceso protegido con contraseña
- ✅ Vista previa de propiedades

### ⚠️ Importante para Producción

- Cambia la contraseña usando las variables de entorno `ADMIN_PASSWORD` y `NEXT_PUBLIC_ADMIN_PASSWORD`
- Mantén seguras tus credenciales de MongoDB Atlas
- Mantén seguras tus credenciales de AWS S3
- Configura restricciones de dominio en Google Maps API Key
- Configura CORS en el bucket de S3 si es necesario

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

## 🔄 Arquitectura de Datos

### Flujo de Datos

```
MongoDB Atlas (datos) + AWS S3 (imágenes) → Next.js Frontend
```

### Gestión de Propiedades

1. Ve al panel de admin: `/admin/properties`
2. Ingresa la contraseña
3. Usa el CRUD para:
   - Crear nuevas propiedades
   - Editar existentes
   - Subir imágenes a S3
   - Eliminar propiedades

### APIs Principales

| Endpoint                   | Método | Descripción                                |
| -------------------------- | ------ | ------------------------------------------ |
| `/api/featured-properties` | GET    | Obtiene propiedades destacadas desde MongoDB |
| `/api/all-properties`      | GET    | Obtiene todas las propiedades desde MongoDB |
| `/api/property/[id]`       | GET    | Obtiene una propiedad específica |
| `/api/admin/properties` | GET, POST | Lista o crea propiedades |
| `/api/admin/properties/[id]` | GET, PUT, DELETE | Obtiene, actualiza o elimina una propiedad |
| `/api/admin/upload-image` | POST | Sube imágenes a S3 |
| `/api/admin/delete-image` | POST | Elimina imágenes de S3 |
| `/api/send-contact-email`  | POST   | Envía formulario de contacto |

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

- `MONGODB_URI`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET_NAME`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_ADMIN_PASSWORD`

## �️ Base de Datos y Almacenamiento

### MongoDB Atlas

El proyecto utiliza MongoDB Atlas como base de datos principal para almacenar toda la información de las propiedades.

#### Colección: properties

Estructura del documento:
- `_id`: ObjectId de MongoDB
- `id`: ID numérico para compatibilidad
- `title`, `slug`, `description`: Información básica
- `price`, `operation`, `type`: Detalles de venta/arriendo
- `region`, `comuna`, `address`: Ubicación
- `bedrooms`, `bathrooms`, `area`: Características
- `images`: Array de URLs de S3
- `featured`: Boolean para destacar
- `active`: Boolean para activar/desactivar
- `latitude`, `longitude`: Coordenadas GPS
- `createdAt`, `updatedAt`: Timestamps

### AWS S3

Las imágenes de las propiedades se almacenan en un bucket de S3:
- Bucket público con acceso directo
- Organización por carpetas: `properties/{id}/`
- URLs públicas para las imágenes
- Eliminación automática al borrar propiedad

## 📄 Licencia

© 2025 Prohausen Propiedades. Todos los derechos reservados.

## 👨‍💻 Soporte y Contacto

Para consultas técnicas o soporte, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ usando Next.js 15 + React 19 + TypeScript**
