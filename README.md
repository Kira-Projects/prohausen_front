# Prohausen Propiedades - Frontend

Aplicación web de corredora de propiedades desarrollada con Next.js 15, React 19 y Tailwind CSS, con MongoDB Atlas y AWS S3.

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
- ✅ **Sistema de autenticación** con roles (admin/user)
- ✅ **Gestión de usuarios** protegida (solo administradores)
- ✅ **Fuente Poppins** integrada con optimización de `next/font`
- ✅ **Paginación** de 12 propiedades por página
- ✅ **Filtros avanzados** con dropdown posicionado junto a "Ordenar por"

## ✨ Últimas Mejoras (Octubre 2025)

### Sistema de Autenticación y Roles
- 🔐 **Autenticación completa**: Sistema de login con JWT y MongoDB
- 👥 **Roles de usuario**: Administrador y Usuario con permisos diferenciados
- 🛡️ **Middleware de protección**: Rutas API protegidas con `withAuth` y `withAdminRole`
- 👑 **Panel de usuarios**: Gestión completa de usuarios (solo para administradores)
- 🔧 **Script de setup**: `create-first-admin.ts` para crear el primer administrador

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
MONGODB_DB_NAME=prohausen_db

# AWS S3
AWS_ACCESS_KEY_ID=tu_access_key_id
AWS_SECRET_ACCESS_KEY=tu_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=prohausen-properties

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key

# JWT Secret (generar uno aleatorio para producción)
JWT_SECRET=tu_secret_key_muy_seguro_aqui
\`\`\`

### Instalación

\`\`\`bash
npm install
\`\`\`

### Crear primer administrador

Antes de iniciar la aplicación por primera vez, crea el usuario administrador:

\`\`\`bash
npm run create-admin
\`\`\`

Esto creará el usuario **Alice** con:
- Email: `contacto@prohausen.cl`
- Contraseña: `admin123`
- Rol: `admin`

⚠️ **Importante**: Cambia la contraseña después del primer login desde el perfil.

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

### Sistema de Autenticación

El panel de administración ahora utiliza un sistema completo de autenticación con:
- **Login seguro** con contraseñas hasheadas (bcrypt)
- **Roles diferenciados**: Admin y User
- **JWT tokens** para sesiones
- **Middleware de protección** en todas las rutas API

### Acceso al Panel

- **URL Local**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **URL Producción**: `https://tu-dominio.com/admin`

**Credenciales iniciales** (creadas con `npm run create-admin`):
- Email: `contacto@prohausen.cl`
- Contraseña: `admin123`
- Rol: Administrador

### Funcionalidades por Rol

#### 👑 Administrador
- ✅ CRUD completo de propiedades
- ✅ Gestión de usuarios (crear, editar, eliminar)
- ✅ Acceso a todas las funcionalidades
- ✅ Ver lista de todos los usuarios

#### 👤 Usuario
- ✅ CRUD de propiedades
- ✅ Ver su propio perfil
- ✅ Cambiar su contraseña
- ❌ No puede gestionar otros usuarios

### Funcionalidades del Panel

- ✅ Crear nuevas propiedades con formulario completo
- ✅ Editar propiedades existentes
- ✅ Eliminar propiedades (con confirmación)
- ✅ Gestión de imágenes (upload múltiple a S3)
- ✅ Listado con búsqueda y filtros
- ✅ Gestión de usuarios (solo administradores)
- ✅ Sistema de roles y permisos
- ✅ Perfil de usuario con cambio de contraseña
- ✅ Vista previa de propiedades

### ⚠️ Importante para Producción

- Crea el primer admin con `npm run create-admin`
- Cambia la contraseña del admin después del primer login
- Usa un `JWT_SECRET` fuerte y aleatorio en producción
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
MongoDB Atlas (metadatos) + AWS S3 (imágenes) → Next.js Frontend
```

**Arquitectura actual (Octubre 2025):**
- **MongoDB Atlas:** Base de datos principal para metadatos de propiedades
- **AWS S3:** Almacenamiento de imágenes y multimedia
- **Next.js 15:** Frontend con App Router y Server Components

### Gestión de Propiedades

1. Ve al panel de admin: `/admin/properties`
2. Ingresa la contraseña
3. Usa el CRUD para:
   - Crear nuevas propiedades
   - Editar existentes
   - Subir imágenes a S3
   - Eliminar propiedades

### APIs Principales

| Endpoint                   | Método | Descripción                                | Protección |
| -------------------------- | ------ | ------------------------------------------ | ---------- |
| `/api/featured-properties` | GET    | Obtiene propiedades destacadas desde MongoDB | Pública |
| `/api/all-properties`      | GET    | Obtiene todas las propiedades desde MongoDB | Pública |
| `/api/property/[id]`       | GET    | Obtiene una propiedad específica | Pública |
| `/api/admin/auth/login`    | POST   | Login de usuario | Pública |
| `/api/admin/auth/me`       | GET    | Obtiene usuario actual | Auth |
| `/api/admin/properties` | GET, POST | Lista o crea propiedades | Auth |
| `/api/admin/properties/[id]` | GET, PUT, DELETE | Obtiene, actualiza o elimina una propiedad | Auth |
| `/api/admin/users` | GET, POST | Lista o crea usuarios | Admin |
| `/api/admin/users/[id]` | GET, PUT, DELETE | Gestiona un usuario específico | Admin |
| `/api/admin/upload-image` | POST | Sube imágenes a S3 | Auth |
| `/api/admin/delete-image` | POST | Elimina imágenes de S3 | Auth |
| `/api/send-contact-email`  | POST   | Envía formulario de contacto | Pública |

**Leyenda:**
- **Pública**: Sin autenticación
- **Auth**: Requiere token de autenticación
- **Admin**: Requiere token + rol de administrador

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

- `MONGODB_URI` - Conexión a MongoDB Atlas
- `MONGODB_DB_NAME` - Nombre de la base de datos
- `AWS_ACCESS_KEY_ID` - Credenciales de AWS
- `AWS_SECRET_ACCESS_KEY` - Credenciales de AWS
- `AWS_REGION` - Región del bucket S3
- `AWS_S3_BUCKET_NAME` - Nombre del bucket
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - API Key de Google Maps
- `JWT_SECRET` - Secret para tokens JWT (genera uno aleatorio y seguro)

## 🗄️ Base de Datos y Almacenamiento

### MongoDB Atlas

El proyecto utiliza MongoDB Atlas como base de datos principal para almacenar la información de propiedades y usuarios.

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

#### Colección: users

Estructura del documento:
- `_id`: ObjectId de MongoDB
- `nombre`: Nombre del usuario
- `email`: Email único
- `password`: Contraseña hasheada con bcrypt
- `role`: Rol del usuario ("admin" o "user")
- `createdAt`, `updatedAt`: Timestamps

### AWS S3

Las imágenes de las propiedades se almacenan en un bucket de S3:
- Bucket público con acceso directo
- Organización por carpetas: `properties/{id}/`
- URLs públicas para las imágenes
- Eliminación automática al borrar propiedad

## 🔧 Scripts de MongoDB

El proyecto incluye scripts útiles para gestionar la base de datos MongoDB en `scripts/`:

### Scripts Disponibles

```bash
# Crear primer usuario administrador
npm run create-admin

# Configurar índices en MongoDB (optimizar performance)
npm run setup:mongodb

# Migrar propiedades desde JSON (restaurar backup)
npm run migrate:properties

# Probar conexión a MongoDB (debugging)
npm run test:mongodb
```

### Estructura de Datos

Coloca tus datos en `scripts/data/properties.json` con este formato:

```json
[
  {
    "id": 1,
    "title": "Casa en Las Condes",
    "slug": "casa-en-las-condes",
    "location": "Las Condes, Santiago",
    "description": "Hermosa casa...",
    "price": "$150.000.000",
    "bedrooms": 4,
    "bathrooms": 3,
    "area": "180 m²",
    "type": "Casa",
    "operation": "Venta",
    "region": "Metropolitana",
    "comuna": "Las Condes",
    "featured": true,
    "active": true,
    "image": "https://bucket.s3.amazonaws.com/image.jpg",
    "images": ["https://..."],
    "address": "Av. Kennedy 5600",
    "latitude": "-33.4110",
    "longitude": "-70.5750"
  }
]
```

### Índices Creados

El script `setup:mongodb` crea los siguientes índices:
- `id` (único) - Búsquedas por ID numérico
- `slug` (único) - URLs amigables
- `featured` - Propiedades destacadas
- `active` - Filtrar activas/inactivas
- `operation` - Filtrar venta/arriendo
- `type` - Filtrar tipo de propiedad
- `region + comuna` (compuesto) - Búsquedas por ubicación
- `title + description` (texto completo) - Búsqueda de texto

**⚠️ IMPORTANTE:** El script de migración elimina todos los datos existentes antes de importar.

## � Historial de Migración

### Migración WordPress → MongoDB + S3 (Octubre 2025)

El proyecto migró exitosamente desde WordPress + Upstash Redis a MongoDB Atlas + AWS S3:

**Arquitectura Anterior:**
```
WordPress → Upstash Redis (cache) → Frontend
```

**Arquitectura Actual:**
```
MongoDB Atlas (metadatos + URLs) → Frontend
AWS S3 (archivos multimedia) ↗
```

**Resultados:**
- ✅ 43 propiedades migradas
- ✅ ~600+ archivos .webp en S3
- ✅ Performance mejorado (consultas directas a BD)
- ✅ Separación de responsabilidades (texto en MongoDB, imágenes en S3)
- ✅ Costos optimizados (S3 pay-as-you-go + MongoDB Atlas tier gratuito)

**Beneficios:**
- Consultas directas a MongoDB con índices optimizados
- Sin latencia de caché intermedio
- Escalabilidad mejorada
- Fuente única de verdad
- Fácil hacer backups

## �📄 Licencia

© 2025 Prohausen Propiedades. Todos los derechos reservados.

## 👨‍💻 Soporte y Contacto

Para consultas técnicas o soporte, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ usando Next.js 15 + React 19 + TypeScript**
