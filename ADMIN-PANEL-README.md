# 📋 Panel de Administración - Prohausen

## 🎯 Funcionalidades Implementadas

### ✅ CRUD Completo de Propiedades

El panel de admin ahora cuenta con todas las operaciones CRUD:

- **C**reate (Crear) ✅
- **R**ead (Leer/Listar) ✅
- **U**pdate (Actualizar/Editar) ✅
- **D**elete (Eliminar) ✅

---

## 🚀 Acceso al Panel

### URL
```
http://localhost:3000/admin/properties
```

### Contraseña por defecto
```
admin2024
```

(Configurada en: `NEXT_PUBLIC_ADMIN_PASSWORD` en `.env.local`)

---

## 📁 Estructura de Archivos

```
src/
├── app/admin/properties/
│   ├── page.tsx              # Panel principal (listado)
│   ├── new/
│   │   └── page.tsx          # Crear nueva propiedad
│   └── [id]/
│       └── edit/
│           └── page.tsx      # Editar propiedad
│
├── components/admin/
│   ├── PropertyForm.tsx      # Formulario reutilizable
│   └── ImageUploader.tsx     # Upload con drag & drop
│
└── app/api/admin/
    ├── properties/
    │   ├── route.ts          # GET, POST
    │   └── [id]/
    │       └── route.ts      # GET, PUT, DELETE
    └── upload-image/
        └── route.ts          # Upload a S3
```

---

## 🎨 Características del Formulario

### Campos Obligatorios (*)
- Título
- Tipo (Casa, Departamento, etc.)
- Operación (Venta/Arriendo)
- Precio
- Área Total
- Región
- Comuna
- Ubicación Descriptiva
- Descripción
- **Al menos 1 imagen**

### Campos Opcionales
- Slug (se genera automático)
- Dormitorios
- Baños
- Medio Baños
- Total Habitaciones
- Área Útil
- Área Terreno
- Número de Pisos
- Piso Ubicación
- Año de Construcción
- Dirección
- País
- Latitud/Longitud
- URL de Video
- 25+ características predefinidas (checkboxes)

### Estados
- ✅ Propiedad Activa (visible en el sitio)
- ⭐ Propiedad Destacada (aparece en home)

---

## 📸 Sistema de Imágenes

### Upload con Drag & Drop
- Arrastra archivos o haz clic para seleccionar
- Formatos soportados: JPG, PNG, WebP
- Tamaño máximo: 10MB por imagen
- Hasta 20 imágenes por propiedad

### Funcionalidades
- ✅ Preview instantáneo
- ✅ Reordenar imágenes (flechas arriba/abajo)
- ✅ Eliminar imágenes antes de guardar
- ✅ La primera imagen = imagen principal
- ✅ Upload a AWS S3 al guardar

### Estructura en S3
```
s3://prohausen/
  └── properties/
      ├── temp/              # Temporales durante creación
      └── {propertyId}/      # Imágenes finales por propiedad
          ├── 1234567-abc.jpg
          ├── 1234568-def.jpg
          └── ...
```

---

## 🔄 Flujo de Trabajo

### Crear Nueva Propiedad

1. **Acceder al panel** → `/admin/properties`
2. **Login** con contraseña
3. **Click** en "Crear Nueva Propiedad"
4. **Completar formulario**:
   - Campos básicos (título, tipo, precio, etc.)
   - Ubicación (región, comuna, coordenadas)
   - Características (dormitorios, baños, etc.)
   - Features (seleccionar de checkboxes)
   - Upload de imágenes (drag & drop)
5. **Click** en "Crear Propiedad"
6. **Sistema automáticamente**:
   - ✅ Sube imágenes a S3
   - ✅ Genera slug automático (si no se provee)
   - ✅ Obtiene siguiente ID disponible
   - ✅ Guarda en MongoDB con URLs de S3
7. **Redirección** al panel principal

### Editar Propiedad Existente

1. **En la tabla** → Click en botón "Editar" (icono lápiz)
2. **Formulario pre-cargado** con datos actuales
3. **Modificar campos** que necesites
4. **Imágenes**:
   - Si no subes nuevas → Se mantienen las actuales
   - Si subes nuevas → Reemplazan completamente las actuales
5. **Click** en "Actualizar Propiedad"
6. **Redirección** al panel principal

### Eliminar Propiedad

1. **En la tabla** → Click en botón "Eliminar" (icono basura)
2. **Confirmar** en el diálogo
3. **Sistema automáticamente**:
   - ✅ Elimina TODAS las imágenes de S3
   - ✅ Elimina el documento de MongoDB
4. **Actualización** de la lista

---

## 🎯 Características del Panel

### Dashboard
- **Estadísticas**: Total, Destacadas, Activas
- **Filtros**:
  - Estado (Activas/Inactivas/Todas)
  - Destacadas (Sí/No/Todas)
- **Búsqueda**: Por título o ubicación
- **Tabla con**:
  - Imagen miniatura
  - Título y ubicación
  - Precio y operación
  - Tipo de propiedad
  - Badges de estado

### Acciones Rápidas
- 👁️ **Ver**: Abre la propiedad en nueva pestaña
- ✏️ **Editar**: Ir a formulario de edición
- 🗑️ **Eliminar**: Elimina propiedad e imágenes

---

## 🔐 Seguridad

### Autenticación
- Password requerido para acceder
- Almacenado en `sessionStorage` durante la sesión
- Header `x-admin-password` en todas las peticiones API

### Middleware
- Todas las rutas `/api/admin/*` protegidas con `withAdminAuth`
- Validación en cada request

### Validaciones
- **Frontend**: Campos requeridos, tipos de archivo, tamaño
- **Backend**: 
  - Campos obligatorios
  - Tipos de datos
  - Slugs únicos (auto-resolución de duplicados)
  - IDs únicos

---

## 🚨 Manejo de Errores

### Slugs Duplicados
Si el slug ya existe, el backend automáticamente agrega el ID:
```
Título: "Casa en Las Condes"
Slug generado: "casa-en-las-condes"

Si ya existe → Guarda como: "casa-en-las-condes-1245"
```

### Upload Fallido
- Mensaje de error específico
- No se crea la propiedad si las imágenes fallan
- Retry manual disponible

### Validación de Imágenes
- Tamaño máximo: 10MB
- Formatos: JPG, PNG, WebP
- Mínimo: 1 imagen requerida

---

## 📊 Base de Datos

### MongoDB Atlas
- **Database**: `prohausen`
- **Collection**: `properties`
- **Campos calculados**:
  - `id`: Auto-incrementado
  - `slug`: Auto-generado desde título
  - `createdAt`: Timestamp de creación
  - `updatedAt`: Timestamp de última actualización

### AWS S3
- **Bucket**: `prohausen` (us-east-2)
- **Acceso**: Público (lectura)
- **URLs**: Almacenadas en MongoDB

---

## 🎨 Features Disponibles (Checkboxes)

1. Piscina
2. Quincho
3. Estacionamiento
4. Bodega
5. Terraza
6. Balcón
7. Jardín
8. Seguridad 24/7
9. Portón Eléctrico
10. Calefacción Central
11. Aire Acondicionado
12. Closet
13. Logia
14. Living-Comedor
15. Cocina Equipada
16. Cocina Amoblada
17. Lavandería
18. Sala de Estar
19. Escritorio
20. Walk-in Closet
21. Baño en Suite
22. Vista Panorámica
23. Luminoso
24. Remodelado
25. Amoblado

*Agregar más en: `src/components/admin/PropertyForm.tsx` → `FEATURE_OPTIONS`*

---

## 🔧 Próximas Mejoras (Opcional)

- [ ] Edición de imágenes sin reemplazar todas
- [ ] Vista previa del slug en tiempo real
- [ ] Validación de slugs únicos en frontend
- [ ] Paginación en la tabla
- [ ] Filtros avanzados
- [ ] Bulk operations (activar/desactivar múltiples)
- [ ] Estadísticas de visualizaciones
- [ ] Historial de cambios
- [ ] Roles de usuario (admin, editor, viewer)

---

## 📞 Soporte

Para dudas o problemas contactar al equipo de desarrollo.

---

**✅ Sistema completamente funcional y listo para producción**
