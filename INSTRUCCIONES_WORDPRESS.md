# Instrucciones para Configurar WordPress

## 📋 Campos Adicionales que Debes Agregar en `functions.php`

Para que el frontend pueda mostrar **todos los detalles de las propiedades**, debes agregar los siguientes campos personalizados de Estatik a la API REST de WordPress.

### 🔧 Código a Agregar en `functions.php`

Agrega este código al archivo `functions.php` de tu tema activo en WordPress:

```php
// Exponer campos personalizados de Estatik en la API REST (versión extendida)
add_action('rest_api_init', function() {
    register_rest_field('properties', 'property_meta', array(
        'get_callback' => function($object) {
            $post_id = $object['id'];
            return array(
                // Campos básicos (ya configurados)
                'price' => get_post_meta($post_id, 'es_property_price', true),
                'bedrooms' => get_post_meta($post_id, 'es_property_bedrooms', true),
                'bathrooms' => get_post_meta($post_id, 'es_property_bathrooms', true),
                'area' => get_post_meta($post_id, 'es_property_size', true),
                'land_area' => get_post_meta($post_id, 'es_property_land', true),
                'address' => get_post_meta($post_id, 'es_property_address', true),

                // Campos extendidos (NUEVOS)
                'zip' => get_post_meta($post_id, 'es_property_zip', true),
                'country' => get_post_meta($post_id, 'es_property_country', true),
                'floors' => get_post_meta($post_id, 'es_property_floors', true),
                'floor_number' => get_post_meta($post_id, 'es_property_floor', true),
                'basement' => get_post_meta($post_id, 'es_property_basement', true),
                'year_built' => get_post_meta($post_id, 'es_property_year_built', true),
                'video_url' => get_post_meta($post_id, 'es_property_video_url', true),
            );
        },
        'schema' => array(
            'description' => 'Metadatos extendidos de la propiedad de Estatik',
            'type' => 'object'
        )
    ));
});
```

### 📝 Notas Importantes:

1. **Nombres de campos:** Los nombres de los campos (`es_property_*`) son los que usa Estatik por defecto. Si tus campos tienen nombres diferentes, deberás ajustarlos.

2. **Verificar nombres de campos:** Para verificar qué campos tiene disponibles Estatik en tu instalación:

   - Ve a WordPress Admin → Estatik → Ajustes → Campos
   - O revisa la tabla `wp_postmeta` en tu base de datos filtrando por el ID de una propiedad

3. **Campos opcionales:** Si alguno de estos campos no existe en tu instalación de Estatik, simplemente elimínalo del array.

### 🔍 Campos ADICIONALES que deberías agregar:

**IMPORTANTE:** El frontend espera estos campos adicionales. Agrégalos al array de `property_meta`:

```php
// Campos adicionales necesarios para el frontend
'half_bathrooms' => get_post_meta($post_id, 'es_property_half_baths', true),
'total_rooms' => get_post_meta($post_id, 'es_property_rooms', true),
```

**Código completo actualizado:**

```php
add_action('rest_api_init', function() {
    register_rest_field('properties', 'property_meta', array(
        'get_callback' => function($object) {
            $post_id = $object['id'];
            return array(
                'price' => get_post_meta($post_id, 'es_property_price', true),
                'bedrooms' => get_post_meta($post_id, 'es_property_bedrooms', true),
                'bathrooms' => get_post_meta($post_id, 'es_property_bathrooms', true),
                'half_bathrooms' => get_post_meta($post_id, 'es_property_half_baths', true),  // ⬅️ NUEVO
                'total_rooms' => get_post_meta($post_id, 'es_property_rooms', true),          // ⬅️ NUEVO
                'area' => get_post_meta($post_id, 'es_property_size', true),
                'land_area' => get_post_meta($post_id, 'es_property_land', true),
                'address' => get_post_meta($post_id, 'es_property_address', true),
                'zip' => get_post_meta($post_id, 'es_property_zip', true),
                'country' => get_post_meta($post_id, 'es_property_country', true),
                'floors' => get_post_meta($post_id, 'es_property_floors', true),
                'floor_number' => get_post_meta($post_id, 'es_property_floor', true),
                'basement' => get_post_meta($post_id, 'es_property_basement', true),
                'year_built' => get_post_meta($post_id, 'es_property_year_built', true),
                'video_url' => get_post_meta($post_id, 'es_property_video_url', true),
            );
        },
        'schema' => array(
            'description' => 'Metadatos extendidos de la propiedad de Estatik',
            'type' => 'object'
        )
    ));
});
```

### 📝 Otros campos comunes de Estatik (opcionales):

```php
// Más campos si los necesitas en el futuro
'garage' => get_post_meta($post_id, 'es_property_garage', true),
'parking_spaces' => get_post_meta($post_id, 'es_property_parking_spaces', true),
'pool' => get_post_meta($post_id, 'es_property_pool', true),
'description' => get_post_meta($post_id, 'es_property_description', true),
'home_area' => get_post_meta($post_id, 'es_property_home_area', true),
'lot_size' => get_post_meta($post_id, 'es_property_lot_size', true),
```

### ✅ Verificación:

Después de agregar el código:

1. Guarda el archivo `functions.php`
2. Prueba el endpoint en tu navegador:
   ```
   https://prohausen.cl/wp-json/wp/v2/properties/[ID]
   ```
3. Busca el objeto `property_meta` en la respuesta JSON
4. Verifica que incluya los nuevos campos

### 🎯 Resultado Esperado:

El JSON de la API debería verse así:

```json
{
  "id": 2269,
  "title": {...},
  "content": {...},
  "property_meta": {
    "price": "450000000",
    "bedrooms": "5",
    "bathrooms": "4",
    "area": "280",
    "land_area": "350",
    "address": "1 Norte, Viña del Mar",
    "zip": "2520000",
    "country": "Chile",
    "floors": "2",
    "floor_number": "0",
    "basement": "-1",
    "year_built": "2015",
    "video_url": "https://www.youtube.com/watch?v=..."
  }
}
```

---

## 🚀 Próximos Pasos:

1. ✅ Agrega el código a `functions.php`
2. ✅ Verifica que los campos aparezcan en la API
3. ✅ Prueba el frontend para ver los detalles de las propiedades

Si tienes dudas o los campos no aparecen, avísame y te ayudo a depurar.
