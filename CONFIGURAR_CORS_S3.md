# 🔧 CONFIGURACIÓN CORS PARA S3

## ⚠️ IMPORTANTE: Debes configurar CORS en tu bucket de S3

Para que la subida directa desde el navegador funcione, necesitas configurar CORS en tu bucket de AWS S3.

## 📋 Pasos para configurar CORS:

### 1. Ve a AWS Console
```
https://console.aws.amazon.com/s3/
```

### 2. Selecciona tu bucket
```
prohausen-prod (o el nombre de tu bucket)
```

### 3. Ve a la pestaña "Permissions"

### 4. Scroll hasta "Cross-origin resource sharing (CORS)"

### 5. Click en "Edit"

### 6. Pega esta configuración JSON:

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "PUT",
      "POST",
      "GET",
      "HEAD"
    ],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://prohausen.cl",
      "https://www.prohausen.cl",
      "https://*.vercel.app"
    ],
    "ExposeHeaders": [
      "ETag",
      "x-amz-request-id"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

### 7. Click en "Save changes"

## 🔍 Explicación de la configuración:

- **AllowedHeaders**: Permite todos los headers (necesario para Content-Type, etc.)
- **AllowedMethods**: PUT (subir), POST (crear), GET (leer), HEAD (metadata)
- **AllowedOrigins**: Dominios permitidos (localhost para dev, tus dominios de producción)
- **ExposeHeaders**: Headers que el navegador puede leer
- **MaxAgeSeconds**: Cache de la política CORS (1 hora)

## ✅ Verificar configuración:

Una vez configurado, puedes verificar que funciona:

```bash
# Desde la consola del navegador (después de desplegar):
curl -i -X OPTIONS \
  -H "Origin: https://prohausen.cl" \
  -H "Access-Control-Request-Method: PUT" \
  https://prohausen-prod.s3.us-east-2.amazonaws.com/
```

Deberías ver headers como:
```
Access-Control-Allow-Origin: https://prohausen.cl
Access-Control-Allow-Methods: PUT, POST, GET, HEAD
```

## 🚨 Si no configuras CORS:

Verás este error en la consola del navegador:
```
Access to fetch at 'https://prohausen-prod.s3.us-east-2.amazonaws.com/...'
from origin 'https://prohausen.cl' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 📝 Notas adicionales:

1. **Wildcard en subdominios Vercel**: El `*.vercel.app` permite todos los preview deployments
2. **Seguridad**: CORS no expone tus credenciales AWS, solo permite requests desde orígenes específicos
3. **Cache**: Si cambias CORS, puede tardar unos minutos en propagarse

## 🎯 Después de configurar CORS:

1. Guarda los cambios en AWS
2. Espera 2-3 minutos para que se propague
3. Prueba subir imágenes desde tu aplicación
4. Verifica en la consola del navegador que no hay errores CORS
