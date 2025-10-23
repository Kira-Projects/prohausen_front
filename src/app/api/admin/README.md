# APIs del Panel de Administración

Documentación de todas las APIs disponibles para el panel de administración.

## 🔐 Autenticación

Todas las rutas del admin requieren autenticación mediante un header personalizado:

```http
x-admin-password: tu_contraseña_admin
```

**Códigos de respuesta de autenticación:**
- `401 Unauthorized`: Falta el header de autenticación
- `403 Forbidden`: Contraseña incorrecta
- `200 OK` / `201 Created`: Autenticación exitosa

---

## 📋 APIs de Propiedades

### 1. Listar Propiedades

**Endpoint:** `GET /api/admin/properties`

**Query Parameters (opcionales):**
- `active` - Filtrar por estado (true/false)
- `featured` - Filtrar por destacadas (true/false)
- `operation` - Filtrar por operación (Venta/Arriendo)
- `type` - Filtrar por tipo (Casa/Departamento/etc)
- `region` - Filtrar por región
- `comuna` - Filtrar por comuna

**Ejemplo de uso:**
```bash
curl -X GET "http://localhost:3000/api/admin/properties?active=true&featured=true" \
  -H "x-admin-password: admin2024"
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "id": 1,
      "title": "Casa en Las Condes",
      "slug": "casa-en-las-condes",
      "price": "$150.000.000",
      "featured": true,
      "active": true,
      ...
    }
  ]
}
```

---

### 2. Obtener Propiedad por ID

**Endpoint:** `GET /api/admin/properties/[id]`

**Ejemplo de uso:**
```bash
curl -X GET "http://localhost:3000/api/admin/properties/1" \
  -H "x-admin-password: admin2024"
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "id": 1,
    "title": "Casa en Las Condes",
    ...
  }
}
```

**Respuesta error (404):**
```json
{
  "error": "Propiedad no encontrada"
}
```

---

### 3. Crear Propiedad

**Endpoint:** `POST /api/admin/properties`

**Campos requeridos:**
- `title` - Título de la propiedad
- `slug` - URL amigable (único)
- `location` - Ubicación general
- `description` - Descripción completa
- `price` - Precio (formato string)
- `area` - Área (formato string con unidad)
- `type` - Tipo de propiedad
- `operation` - Venta o Arriendo
- `region` - Región
- `comuna` - Comuna
- `image` - URL de imagen principal (S3)

**Campos opcionales:**
- `id` - ID numérico (se autogenera si no se provee)
- `bedrooms`, `bathrooms`, `halfBathrooms`, `totalRooms`
- `images` - Array de URLs de imágenes adicionales
- `featured` - Boolean (default: false)
- `active` - Boolean (default: true)
- `usefulArea`, `landArea`
- `address`, `latitude`, `longitude`
- `videoUrl`, `features`, etc.

**Ejemplo de uso:**
```bash
curl -X POST "http://localhost:3000/api/admin/properties" \
  -H "x-admin-password: admin2024" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Casa Nueva",
    "slug": "casa-nueva",
    "location": "Santiago",
    "description": "Hermosa casa...",
    "price": "$100.000.000",
    "area": "120 m²",
    "type": "Casa",
    "operation": "Venta",
    "region": "Metropolitana",
    "comuna": "Las Condes",
    "image": "https://bucket.s3.amazonaws.com/image.jpg",
    "featured": true
  }'
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Propiedad creada exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "id": 2,
    "title": "Casa Nueva",
    ...
  }
}
```

**Respuesta error (409 - Duplicado):**
```json
{
  "error": "Ya existe una propiedad con ese ID o slug. Por favor usa valores únicos."
}
```

---

### 4. Actualizar Propiedad

**Endpoint:** `PUT /api/admin/properties/[id]`

**Body:** Cualquier campo que quieras actualizar (todos opcionales)

**Ejemplo de uso:**
```bash
curl -X PUT "http://localhost:3000/api/admin/properties/1" \
  -H "x-admin-password: admin2024" \
  -H "Content-Type: application/json" \
  -d '{
    "price": "$160.000.000",
    "featured": true,
    "active": true
  }'
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Propiedad actualizada exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "id": 1,
    "price": "$160.000.000",
    ...
  }
}
```

---

### 5. Eliminar Propiedad

**Endpoint:** `DELETE /api/admin/properties/[id]`

**Nota:** Esto eliminará:
1. La propiedad de MongoDB
2. Todas las imágenes asociadas de S3

**Ejemplo de uso:**
```bash
curl -X DELETE "http://localhost:3000/api/admin/properties/1" \
  -H "x-admin-password: admin2024"
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Propiedad e imágenes eliminadas exitosamente"
}
```

---

## 🖼️ APIs de Imágenes

### 6. Subir Imagen

**Endpoint:** `POST /api/admin/upload-image`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` - Archivo de imagen (required)
- `propertyId` - ID de la propiedad (opcional)

**Tipos permitidos:** JPG, JPEG, PNG, WebP  
**Tamaño máximo:** 10 MB

**Ejemplo de uso:**
```bash
curl -X POST "http://localhost:3000/api/admin/upload-image" \
  -H "x-admin-password: admin2024" \
  -F "file=@/path/to/image.jpg" \
  -F "propertyId=1"
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Imagen subida exitosamente",
  "data": {
    "url": "https://bucket.s3.region.amazonaws.com/properties/1/1234567890-abc123.jpg",
    "key": "properties/1/1234567890-abc123.jpg",
    "size": 2048576,
    "type": "image/jpeg"
  }
}
```

**Respuesta error (400):**
```json
{
  "error": "Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG y WebP"
}
```

---

### 7. Eliminar Imagen

**Endpoint:** `POST /api/admin/delete-image`

**Body:**
```json
{
  "imageUrl": "https://bucket.s3.region.amazonaws.com/properties/1/image.jpg"
}
```

**Ejemplo de uso:**
```bash
curl -X POST "http://localhost:3000/api/admin/delete-image" \
  -H "x-admin-password: admin2024" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://bucket.s3.region.amazonaws.com/properties/1/image.jpg"
  }'
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Imagen eliminada exitosamente",
  "data": {
    "deletedKey": "properties/1/image.jpg",
    "deletedUrl": "https://bucket.s3.region.amazonaws.com/properties/1/image.jpg"
  }
}
```

---

## 🔄 Flujo Completo de Creación

### Paso 1: Subir imágenes
```bash
# Subir imagen principal
curl -X POST "http://localhost:3000/api/admin/upload-image" \
  -H "x-admin-password: admin2024" \
  -F "file=@image1.jpg" \
  -F "propertyId=temp"

# Respuesta: { "data": { "url": "https://..." } }
```

### Paso 2: Crear propiedad con las URLs
```bash
curl -X POST "http://localhost:3000/api/admin/properties" \
  -H "x-admin-password: admin2024" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nueva Propiedad",
    "slug": "nueva-propiedad",
    "image": "URL_DE_IMAGEN_PRINCIPAL",
    "images": ["URL1", "URL2", "URL3"],
    ...
  }'
```

### Paso 3: Actualizar si es necesario
```bash
curl -X PUT "http://localhost:3000/api/admin/properties/1" \
  -H "x-admin-password: admin2024" \
  -H "Content-Type: application/json" \
  -d '{ "featured": true }'
```

---

## 🧪 Testing

Puedes probar las APIs usando:

### Con cURL:
```bash
export ADMIN_PASS="admin2024"
curl -X GET "http://localhost:3000/api/admin/properties" \
  -H "x-admin-password: $ADMIN_PASS"
```

### Con Postman:
1. Importa la colección (si la creas)
2. Configura el header `x-admin-password` en las variables de entorno
3. Ejecuta las requests

### Con Thunder Client (VSCode):
1. Instala la extensión Thunder Client
2. Crea requests con el header `x-admin-password`
3. Guarda la colección

---

## ⚠️ Notas Importantes

1. **Seguridad**: Nunca expongas tu `ADMIN_PASSWORD` en el código frontend
2. **CORS**: Si usas desde un dominio diferente, configura CORS en Next.js
3. **Rate Limiting**: Considera agregar rate limiting en producción
4. **Validación**: Siempre valida los datos en el backend
5. **Imágenes**: Las imágenes en S3 son públicas por defecto
6. **MongoDB**: Los índices deben estar creados para mejor performance

---

## 📚 Recursos

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
