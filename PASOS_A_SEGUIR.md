# 🚀 Pasos a Seguir para Corregir los Datos

## ✅ Cambios YA Realizados en el Frontend:

1. ✅ Agregados campos `halfBathrooms` y `totalRooms` a los tipos TypeScript
2. ✅ Actualizado el mapeo de datos en `mapWordPressData.ts`
3. ✅ Corregida la prioridad de superficies (ahora muestra `land_area` primero)
4. ✅ Agregado log para debug: `🔍 property_meta para {id}:`
5. ✅ UI actualizada con layout de 4 columnas (como WordPress)

---

## 📋 LO QUE TÚ DEBES HACER EN WORDPRESS:

### Paso 1: Acceder a WordPress

1. Ve a tu WordPress: `https://prohausen.cl/wp-admin`
2. Navega a: **Apariencia → Editor de Archivos de Tema**
3. Busca el archivo: `functions.php` de tu tema activo

### Paso 2: Agregar el Código PHP

**REEMPLAZA** el código anterior (si existe) con este código completo:

```php
<?php
// Exponer campos personalizados de Estatik en la API REST
add_action('rest_api_init', function() {
    register_rest_field('properties', 'property_meta', array(
        'get_callback' => function($object) {
            $post_id = $object['id'];
            return array(
                // Campos básicos
                'price' => get_post_meta($post_id, 'es_property_price', true),
                'bedrooms' => get_post_meta($post_id, 'es_property_bedrooms', true),
                'bathrooms' => get_post_meta($post_id, 'es_property_bathrooms', true),

                // NUEVOS CAMPOS IMPORTANTES ⬇️
                'half_bathrooms' => get_post_meta($post_id, 'es_property_half_baths', true),
                'total_rooms' => get_post_meta($post_id, 'es_property_rooms', true),

                // Superficies
                'area' => get_post_meta($post_id, 'es_property_size', true),
                'land_area' => get_post_meta($post_id, 'es_property_land', true),

                // Ubicación
                'address' => get_post_meta($post_id, 'es_property_address', true),
                'zip' => get_post_meta($post_id, 'es_property_zip', true),
                'country' => get_post_meta($post_id, 'es_property_country', true),

                // Detalles de construcción
                'floors' => get_post_meta($post_id, 'es_property_floors', true),
                'floor_number' => get_post_meta($post_id, 'es_property_floor', true),
                'basement' => get_post_meta($post_id, 'es_property_basement', true),
                'year_built' => get_post_meta($post_id, 'es_property_year_built', true),

                // Multimedia
                'video_url' => get_post_meta($post_id, 'es_property_video_url', true),
            );
        },
        'schema' => array(
            'description' => 'Metadatos extendidos de la propiedad de Estatik',
            'type' => 'object'
        )
    ));
});
?>
```

### Paso 3: Guardar y Verificar

1. **Guarda** el archivo `functions.php`
2. Abre tu navegador en modo incógnito
3. Ve a: `https://prohausen.cl/wp-json/wp/v2/properties/2269`
4. Busca el objeto `property_meta` en el JSON
5. **Verifica que incluya:**
   ```json
   "property_meta": {
     "half_bathrooms": "0",    // ⬅️ DEBE APARECER
     "total_rooms": "5",       // ⬅️ DEBE APARECER
     "area": "242",
     "land_area": "973",
     ...
   }
   ```

---

## 🔍 Cómo Verificar que Todo Funciona:

### 1. En la Consola del Navegador (F12):

Deberías ver algo como:

```
🔍 property_meta para 2269: {
  price: "14890",
  bedrooms: "5",
  bathrooms: "4",
  half_bathrooms: "0",      // ⬅️ Ahora debe tener valor
  total_rooms: "5",         // ⬅️ Ahora debe tener valor
  area: "242",
  land_area: "973",
  ...
}
```

### 2. En el Frontend:

Verifica que se muestren correctamente:

- **Medios baños**: Debe mostrar el valor real (ej: 0)
- **Habitaciones totales**: Debe mostrar el valor real (ej: 5)
- **Superficie total**: Debe mostrar 973 m²
- **Superficie Útil**: Debe mostrar 242 m²

---

## ⚠️ IMPORTANTE: Nombres de Campos en Estatik

Los nombres de los campos (`es_property_*`) pueden variar según tu versión de Estatik.

### Si los campos NO aparecen en la API:

1. Ve a WordPress Admin → Estatik → Ajustes → Campos
2. Busca los nombres EXACTOS de los campos en tu instalación
3. O revisa la base de datos: tabla `wp_postmeta` para una propiedad

### Nombres comunes alternativos:

- `half_bathrooms` puede ser:

  - `es_property_half_baths`
  - `es_property_half_bathrooms`
  - `es_property_powder_rooms`

- `total_rooms` puede ser:
  - `es_property_rooms`
  - `es_property_total_rooms`

---

## 🐛 Solución de Problemas:

### Problema 1: "Los campos siguen apareciendo como 0"

**Causa:** El campo no existe en WordPress o tiene un nombre diferente.

**Solución:**

1. Verifica que Estatik tenga esos campos configurados
2. Revisa la tabla `wp_postmeta` en phpMyAdmin
3. Busca campos que contengan "half", "bath", "room"
4. Actualiza el nombre del campo en `functions.php`

### Problema 2: "property_meta no aparece en la API"

**Causa:** Error en el código PHP o permisos.

**Solución:**

1. Verifica que no haya errores de sintaxis en `functions.php`
2. Activa el modo debug de WordPress:
   - Edita `wp-config.php`
   - Agrega: `define('WP_DEBUG', true);`
3. Revisa los logs de errores

### Problema 3: "Las superficies están invertidas"

**Causa:** Ya está corregido en el frontend.

**Verificación:**

- `area` = 242 m² (superficie útil/construida)
- `land_area` = 973 m² (superficie total/terreno)

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:

1. **Copia el JSON** de `https://prohausen.cl/wp-json/wp/v2/properties/2269`
2. **Copia la consola del navegador** (F12)
3. **Envíame** esa información para ayudarte a debuggear

---

## ✅ Checklist Final:

- [ ] Código agregado a `functions.php`
- [ ] Archivo guardado correctamente
- [ ] API verificada en el navegador
- [ ] `property_meta` incluye `half_bathrooms`
- [ ] `property_meta` incluye `total_rooms`
- [ ] Frontend muestra los valores correctos
- [ ] Logs en consola se ven correctos
- [ ] Superficies se muestran correctamente

¡Una vez que completes estos pasos, todo debería funcionar perfectamente!
