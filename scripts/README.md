# Scripts de MongoDB

Este directorio contiene scripts para gestionar la base de datos MongoDB.

## 📁 Estructura

```
scripts/
├── data/
│   ├── properties.json           # Datos reales (gitignored)
│   └── properties.example.json   # Ejemplo de estructura
├── migrate-data.ts               # Script de migración de datos
└── setup-mongodb-indexes.ts      # Script de configuración de índices
```

## 🚀 Uso

### 1. Configurar índices en MongoDB

Este script crea todos los índices necesarios para optimizar las búsquedas:

```bash
npm run setup:mongodb
```

**Índices creados:**
- `id` (único) - Para búsquedas por ID numérico
- `slug` (único) - Para URLs amigables
- `featured` - Para propiedades destacadas
- `active` - Para filtrar activas/inactivas
- `active + featured` (compuesto) - Búsquedas combinadas
- `operation` - Para filtrar venta/arriendo
- `type` - Para filtrar tipo de propiedad
- `region + comuna` (compuesto) - Búsquedas por ubicación
- `title + description` (texto completo) - Búsqueda de texto
- `createdAt` - Ordenar por fecha de creación
- `updatedAt` - Ordenar por última actualización

### 2. Migrar datos desde JSON

Este script importa propiedades desde un archivo JSON a MongoDB:

```bash
# Paso 1: Coloca tus datos en scripts/data/properties.json
# Paso 2: Ejecuta la migración
npm run migrate:properties
```

**⚠️ IMPORTANTE:** Este script **elimina todos los datos existentes** antes de importar. Úsalo con precaución.

## 📝 Formato del JSON

El archivo `properties.json` debe tener este formato:

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
    "images": [
      "https://bucket.s3.amazonaws.com/image1.jpg",
      "https://bucket.s3.amazonaws.com/image2.jpg"
    ],
    "address": "Av. Kennedy 5600",
    "latitude": "-33.4110",
    "longitude": "-70.5750",
    "usefulArea": "160 m²",
    "landArea": "200 m²",
    "totalRooms": 5,
    "videoUrl": "https://youtube.com/watch?v=..."
  }
]
```

## 🔐 Variables de Entorno

Asegúrate de tener configurado en tu `.env.local`:

```bash
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/prohausen?retryWrites=true&w=majority
```

## 📊 Verificación

Después de ejecutar los scripts, puedes verificar en MongoDB Atlas:

1. Ve a tu cluster en MongoDB Atlas
2. Click en "Browse Collections"
3. Verifica la colección `properties`
4. Revisa los índices en la pestaña "Indexes"

## 🆘 Troubleshooting

### Error: "No se encontró el archivo properties.json"
- Asegúrate de crear el archivo en `scripts/data/properties.json`
- Puedes usar `properties.example.json` como referencia

### Error: "Invalid connection string"
- Verifica que `MONGODB_URI` esté correctamente configurado en `.env.local`
- Asegúrate de reemplazar `<db_password>` con tu contraseña real

### Error: "Duplicate key error"
- Ya existe una propiedad con el mismo `id` o `slug`
- Verifica que los IDs sean únicos en tu JSON
- Verifica que los slugs sean únicos

## 📚 Documentación Adicional

- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Indexing Strategies](https://www.mongodb.com/docs/manual/indexes/)
