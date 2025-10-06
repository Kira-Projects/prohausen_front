# 🚀 Configuración Final de Upstash Redis

## ✅ Instalación Completada

El proyecto ya está configurado para usar **Upstash Redis** en lugar de Vercel KV.

### Paquetes instalados:

- ✅ `@upstash/redis` - Cliente Redis para Upstash
- ❌ `@vercel/kv` - Desinstalado

---

## 🔑 PASO FINAL: Configurar el Token

### 1. Abre el archivo `.env.local`

Encontrarás esta línea:

```bash
UPSTASH_REDIS_REST_TOKEN=TU_TOKEN_AQUI_REEMPLAZAR
```

### 2. Reemplaza `TU_TOKEN_AQUI_REEMPLAZAR` con tu token real

El token que me pasaste estaba censurado con `********`. Debes poner el token completo que aparece en tu consola de Upstash.

Debería verse así:

```bash
UPSTASH_REDIS_REST_TOKEN=AbbkAAIncDE5NzI4YWEwNjkzMjE0YjA0YjliNGEyNjFiOWJjNDQ5YXAxMA
```

### 3. Guarda el archivo `.env.local`

---

## 🧪 Probar la Conexión

### Opción A: Modo Desarrollo

```bash
npm run dev
```

Luego abre http://localhost:3000 y revisa la consola del navegador (F12). Deberías ver:

**Primera carga (cache miss):**

```
⚠️ Cache miss - Obteniendo de WordPress API...
⏱️ WordPress API respondió en 4700ms
💾 Propiedades guardadas en REDIS CACHE (TTL: 30min)
```

**Segunda carga (cache hit):**

```
✅ Propiedades destacadas servidas desde REDIS CACHE
⚡ 4 propiedades destacadas cargadas en 850ms
```

### Opción B: Probar Compilación

```bash
npm run build
npm start
```

---

## 📊 Verificar en Upstash Dashboard

1. Ve a https://console.upstash.com
2. Selecciona tu base de datos `in-oyster-19728`
3. Ve a la pestaña **Data Browser**
4. Después de cargar la página, deberías ver estas keys:
   - `featured-properties` (TTL: 1800s / 30 min)
   - `all-properties` (TTL: 900s / 15 min)
   - `property-{id}` (TTL: 3600s / 1 hora)

---

## 🔧 Variables de Entorno Configuradas

### En `.env.local` (desarrollo local):

```bash
UPSTASH_REDIS_REST_URL=https://in-oyster-19728.upstash.io
UPSTASH_REDIS_REST_TOKEN=TU_TOKEN_REAL_AQUI  # ← CAMBIAR ESTO
CACHE_INVALIDATE_SECRET=prohausen-cache-2024
```

### En Vercel (producción):

Cuando despliegues a Vercel, debes agregar estas variables en:

**Vercel Dashboard → Settings → Environment Variables:**

| Variable                   | Valor                                       |
| -------------------------- | ------------------------------------------- |
| `UPSTASH_REDIS_REST_URL`   | `https://in-oyster-19728.upstash.io`        |
| `UPSTASH_REDIS_REST_TOKEN` | Tu token real de Upstash                    |
| `CACHE_INVALIDATE_SECRET`  | `prohausen-cache-2024` (o genera uno nuevo) |

**Importante:** Selecciona todos los ambientes (Production, Preview, Development)

---

## 🎯 Cómo Funciona

### Arquitectura del Caché

```
┌─────────────────┐
│  Usuario visita │
│   la página     │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  FeaturedProperties │
│     Component       │
└────────┬────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ getFeaturedPropertiesWithCache()     │
└────────┬─────────────────────────────┘
         │
         ▼
    ┌────────┐
    │ Redis? │ ◄─── Upstash Redis
    └───┬────┘
        │
    ┌───▼──────────┐
    │ ¿Hay caché?  │
    └───┬──────┬───┘
        │      │
     SI │      │ NO
        │      │
        ▼      ▼
   ┌────────┐ ┌────────────────┐
   │ Return │ │ WordPress API  │
   │  850ms │ │    4700ms      │
   └────────┘ └───────┬────────┘
                      │
                      ▼
              ┌───────────────┐
              │ Guardar cache │
              │  en Upstash   │
              └───────────────┘
```

### TTL (Time To Live)

| Cache Key             | TTL    | Razón                                 |
| --------------------- | ------ | ------------------------------------- |
| `featured-properties` | 30 min | Homepage - Alta prioridad             |
| `all-properties`      | 15 min | Listado completo - Cambios frecuentes |
| `property-{id}`       | 1 hora | Detalles individuales - Más estable   |

---

## 🛠️ Comandos Útiles

### Desarrollo

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Compila el proyecto
npm start            # Inicia servidor de producción
```

### Invalidar Cache Manualmente

```bash
# Desarrollo (localhost)
curl -X POST "http://localhost:3000/api/cache/invalidate?secret=prohausen-cache-2024"

# Producción (cuando despliegues)
curl -X POST "https://tu-dominio.vercel.app/api/cache/invalidate?secret=prohausen-cache-2024"
```

Respuesta esperada:

```json
{
  "success": true,
  "message": "Caché invalidado exitosamente",
  "timestamp": "2025-10-06T..."
}
```

---

## 📈 Mejora de Performance Esperada

| Métrica           | Antes | Después      | Mejora        |
| ----------------- | ----- | ------------ | ------------- |
| Primera carga     | 4.7s  | 4.7s         | 0% (normal)   |
| Segunda carga     | 4.7s  | **0.8-1.5s** | **68-83%** 🚀 |
| Promedio (30 min) | 4.7s  | **~1.2s**    | **74%** ⚡    |

---

## 🐛 Solución de Problemas

### Error: "Redis connection failed"

**Causa:** Token incorrecto o no configurado

**Solución:**

1. Verifica que el token en `.env.local` sea el correcto
2. Asegúrate de que no tenga espacios ni saltos de línea
3. Reinicia el servidor de desarrollo: `npm run dev`

### Error: "UPSTASH_REDIS_REST_URL is not defined"

**Causa:** Variables de entorno no cargadas

**Solución:**

1. Verifica que el archivo `.env.local` exista en la raíz del proyecto
2. Reinicia el servidor de desarrollo
3. En producción, verifica las variables en Vercel Dashboard

### Cache no funciona (siempre "API - 4700ms")

**Causa:** Redis no está conectado o hay error de conexión

**Solución:**

1. Abre la consola del navegador (F12)
2. Busca errores en color rojo
3. Verifica que las credenciales de Upstash sean correctas
4. Prueba la conexión desde Upstash Dashboard → CLI

### En producción no funciona

**Causa:** Variables de entorno no configuradas en Vercel

**Solución:**

1. Ve a Vercel Dashboard → Tu proyecto → Settings → Environment Variables
2. Agrega las 3 variables mencionadas arriba
3. Re-despliega el proyecto

---

## ✅ Checklist Final

- [ ] Reemplazar `TU_TOKEN_AQUI_REEMPLAZAR` en `.env.local` con el token real
- [ ] Ejecutar `npm run dev` para probar en desarrollo
- [ ] Abrir http://localhost:3000 y verificar tiempos de carga
- [ ] Recargar la página 2 veces y ver que dice "🚀 CACHE" en la segunda
- [ ] Verificar en Upstash Dashboard → Data Browser que aparecen las keys
- [ ] Al desplegar en Vercel, agregar las variables de entorno
- [ ] Probar en producción después del despliegue

---

## 🎉 ¡Listo!

Una vez que reemplaces el token en `.env.local`, tu aplicación estará lista para usar Redis cache con Upstash.

**Resultado esperado:**

- ✅ Primera visita: ~4.7s (carga desde WordPress, guarda en Redis)
- ✅ Visitas siguientes: ~0.8-1.5s (carga desde Redis - **70% más rápido**)
- ✅ Caché se renueva automáticamente cada 30 minutos
- ✅ Puedes invalidar manualmente cuando actualices propiedades en WordPress

---

## 📞 Siguiente Paso

**REEMPLAZA el token en `.env.local` y ejecuta:**

```bash
npm run dev
```

Luego abre http://localhost:3000 y verifica la consola del navegador (F12) para ver los logs de Redis cache funcionando.

**¿Todo listo?** 🚀
