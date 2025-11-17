"use client";

import { useState, FormEvent, useEffect } from "react";
import ImageUploader, { ImageItem } from "./ImageUploader";
import { Property } from "@/types/property";

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (formData: FormData, images: ImageItem[]) => Promise<void>;
  submitLabel?: string;
}

// Opciones predefinidas para características
const FEATURE_OPTIONS = [
  "Piscina",
  "Quincho",
  "Estacionamiento",
  "Bodega",
  "Terraza",
  "Balcón",
  "Jardín",
  "Seguridad 24/7",
  "Portón Eléctrico",
  "Calefacción Central",
  "Aire Acondicionado",
  "Closet",
  "Logia",
  "Living-Comedor",
  "Cocina Equipada",
  "Cocina Amoblada",
  "Lavandería",
  "Sala de Estar",
  "Escritorio",
  "Walk-in Closet",
  "Baño en Suite",
  "Vista Panorámica",
  "Luminoso",
  "Remodelado",
  "Amoblado",
];

const PROPERTY_TYPES = ["Casa", "Departamento", "Derecho a llave", "Parcela", "Penthouse"];
const OPERATION_TYPES = ["Venta", "Arriendo"];
const REGIONS = [
  "Metropolitana",
  "Valparaíso",
  "O'Higgins",
  "Maule",
  "Biobío",
  "Araucanía",
  "Los Lagos",
  "Aysén",
  "Magallanes",
  "Coquimbo",
  "Atacama",
  "Antofagasta",
  "Tarapacá",
  "Arica y Parinacota",
  "Los Ríos",
  "Ñuble",
];

export default function PropertyForm({
  initialData,
  onSubmit,
  submitLabel = "Guardar Propiedad",
}: PropertyFormProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    initialData?.features || []
  );

  // Inicializar imágenes existentes cuando hay initialData
  useEffect(() => {
    if (initialData?.images && initialData.images.length > 0) {
      const existingImages: ImageItem[] = initialData.images.map((url, index) => ({
        type: 'existing' as const,
        url,
        id: `existing-${index}-${url}`,
      }));
      setImages(existingImages);
    }
  }, [initialData]);

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);
      
      // Combinar moneda y monto en un solo campo "price"
      const currency = formData.get("priceCurrency") as string;
      const amount = formData.get("priceAmount") as string;
      if (currency && amount) {
        let priceText = "";
        if (currency === "UF") {
          priceText = `UF ${amount}`;
        } else if (currency === "CLP") {
          priceText = `$${amount}`;
        } else if (currency === "USD") {
          priceText = `US$${amount}`;
        }
        formData.set("price", priceText);
        formData.delete("priceCurrency");
        formData.delete("priceAmount");
      }
      
      // Agregar features al FormData
      formData.set("features", JSON.stringify(selectedFeatures));
      
      // Auto-generar slug desde el título si no existe
      const title = formData.get("title") as string;
      const slug = formData.get("slug") as string;
      if (!slug && title) {
        formData.set("slug", generateSlug(title));
      }

      await onSubmit(formData, images);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-md">
      {/* Información Básica */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Información Básica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Título */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              defaultValue={initialData?.title}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Casa Moderna en Las Condes"
            />
          </div>

          {/* Slug */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Slug (URL amigable)
            </label>
            <input
              type="text"
              name="slug"
              defaultValue={initialData?.slug}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Se genera automáticamente desde el título"
            />
            <p className="text-xs text-gray-700 mt-1">
              Se generará automáticamente si se deja vacío
            </p>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              defaultValue={initialData?.type}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar tipo</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Operación */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Operación <span className="text-red-500">*</span>
            </label>
            <select
              name="operation"
              defaultValue={initialData?.operation}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar operación</option>
              {OPERATION_TYPES.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Precio <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                name="priceCurrency"
                defaultValue={initialData?.price?.includes('$') ? 'CLP' : 'UF'}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="UF">UF</option>
                <option value="CLP">$</option>
                <option value="USD">US$</option>
              </select>
              <input
                type="text"
                name="priceAmount"
                defaultValue={initialData?.price?.replace(/[^\d.,]/g, '').trim()}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 5.800"
              />
            </div>
          </div>

          {/* Área */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Área Total <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="area"
              defaultValue={initialData?.area}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 120 m²"
            />
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ubicación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Región */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Región <span className="text-red-500">*</span>
            </label>
            <select
              name="region"
              defaultValue={initialData?.region}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar región</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Comuna */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Comuna <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="comuna"
              defaultValue={initialData?.comuna}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Las Condes"
            />
          </div>

          {/* Location (descripción) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Ubicación Descriptiva <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              defaultValue={initialData?.location}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Las Condes, Región Metropolitana"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Dirección
            </label>
            <input
              type="text"
              name="address"
              defaultValue={initialData?.address}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Av. Apoquindo 1234"
            />
          </div>

          {/* País */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              País
            </label>
            <input
              type="text"
              name="country"
              defaultValue={initialData?.country || "Chile"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Mapa (Iframe embebido) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Mapa (Iframe de Google Maps)
            </label>
            <textarea
              name="mapIframe"
              defaultValue={initialData?.mapIframe}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder='Pega aquí el iframe de Google Maps. Ej: <iframe src="https://www.google.com/maps/embed?..." width="600" height="450" ...></iframe>'
            />
            <p className="text-xs text-gray-600 mt-1">
              💡 <strong>Cómo obtener el iframe:</strong> Ve a Google Maps → Busca la dirección → Clic en &quot;Compartir&quot; → Clic en &quot;Insertar un mapa&quot; → Copia el código
            </p>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="border-b pb-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción</h2>
        <textarea
          name="description"
          defaultValue={initialData?.description}
          required
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe la propiedad con el mayor detalle posible..."
        />
      </div>

      {/* Características Numéricas */}
      <div className="border-b pb-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">Características</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Dormitorios */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Dormitorios
            </label>
            <input
              type="number"
              name="bedrooms"
              defaultValue={initialData?.bedrooms}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Baños */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Baños
            </label>
            <input
              type="number"
              name="bathrooms"
              defaultValue={initialData?.bathrooms}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Medio Baños */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Medio Baños
            </label>
            <input
              type="number"
              name="halfBathrooms"
              defaultValue={initialData?.halfBathrooms}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Total Habitaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Total Habitaciones
            </label>
            <input
              type="number"
              name="totalRooms"
              defaultValue={initialData?.totalRooms}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Área Útil */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Área Útil
            </label>
            <input
              type="text"
              name="usefulArea"
              defaultValue={initialData?.usefulArea}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 95 m²"
            />
          </div>

          {/* Área Terreno */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Área Terreno
            </label>
            <input
              type="text"
              name="landArea"
              defaultValue={initialData?.landArea}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 300 m²"
            />
          </div>

          {/* Pisos */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Número de Pisos
            </label>
            <input
              type="number"
              name="floors"
              defaultValue={initialData?.floors}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Número de Piso */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Piso Ubicación
            </label>
            <input
              type="number"
              name="floorNumber"
              defaultValue={initialData?.floorNumber}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Año Construcción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Año de Construcción
            </label>
            <input
              type="number"
              name="yearBuilt"
              defaultValue={initialData?.yearBuilt}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Features (Características) */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Características Adicionales
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {FEATURE_OPTIONS.map((feature) => (
            <label
              key={feature}
              className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedFeatures.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Video URL */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Multimedia</h2>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            URL de Video (YouTube, Vimeo, etc.)
          </label>
          <input
            type="url"
            name="videoUrl"
            defaultValue={initialData?.videoUrl}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </div>

      {/* Imágenes */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Imágenes <span className="text-red-500">*</span>
        </h2>
        <ImageUploader images={images} onImagesChange={setImages} />
        {images.length === 0 && (
          <p className="text-sm text-red-500 mt-2">
            Debes tener al menos una imagen
          </p>
        )}
      </div>

      {/* Estados */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Estado</h2>
        <div className="flex gap-6">
          {/* Activa */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="active"
              defaultChecked={initialData?.active ?? true}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Propiedad Activa
            </span>
          </label>

          {/* Destacada */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={initialData?.featured ?? false}
              className="w-5 h-5 text-yellow-600 rounded focus:ring-2 focus:ring-yellow-500"
            />
            <span className="text-sm font-medium text-gray-900">
              Propiedad Destacada
            </span>
          </label>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading || images.length === 0}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Guardando...
            </>
          ) : (
            submitLabel
          )}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
