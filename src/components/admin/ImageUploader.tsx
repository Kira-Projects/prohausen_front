"use client";

import { useState, useRef, DragEvent } from "react";
import Image from "next/image";

// Tipo unificado para manejar tanto imágenes existentes como nuevas
export type ImageItem =
  | { type: 'existing'; url: string; id: string }
  | { type: 'new'; file: File; preview: string; id: string };

interface ImageUploaderProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages?: number;
  label?: string;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 20,
  label = "Imágenes",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (files: File[]) => {
    // Filtrar solo imágenes
    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    // Validar tamaño máximo (10MB por imagen)
    const validFiles = imageFiles.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`La imagen ${file.name} es demasiado grande. Máximo 10MB.`);
        return false;
      }
      return true;
    });

    // Validar cantidad máxima
    if (images.length + validFiles.length > maxImages) {
      alert(`Solo puedes subir hasta ${maxImages} imágenes.`);
      return;
    }

    // Crear previews para archivos nuevos
    const newImages: ImageItem[] = validFiles.map((file) => ({
      type: 'new' as const,
      file,
      preview: URL.createObjectURL(file),
      id: `new-${Date.now()}-${Math.random()}`,
    }));

    onImagesChange([...images, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    const imageToRemove = images.find((img) => img.id === id);
    if (imageToRemove && imageToRemove.type === 'new') {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    onImagesChange(images.filter((img) => img.id !== id));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  // Funciones para drag-and-drop de reordenamiento
  const handleImageDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleImageDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      handleReorder(draggedIndex, dropIndex);
    }
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-900">
        {label} {images.length > 0 && `(${images.length}/${maxImages})`}
      </label>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm font-medium text-gray-900">
            Arrastra imágenes aquí o haz clic para seleccionar
          </p>
          <p className="text-xs text-gray-700">
            PNG, JPG, WebP hasta 10MB cada una
          </p>
        </div>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={(e) => handleImageDragStart(e, index)}
              onDragEnd={handleImageDragEnd}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDragLeave={handleImageDragLeave}
              onDrop={(e) => handleImageDrop(e, index)}
              className={`
                relative group bg-gray-100 rounded-lg overflow-hidden aspect-square
                transition-all duration-200
                ${dragOverIndex === index && draggedIndex !== index ? 'ring-4 ring-blue-500 scale-105' : ''}
                ${draggedIndex === index ? 'opacity-50 cursor-grabbing' : 'opacity-100 cursor-grab'}
              `}
              title="Arrastra para reordenar"
            >
              {/* Imagen */}
              <Image
                src={image.type === 'existing' ? image.url : image.preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />

              {/* Badge de posición */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>

              {/* Icono de arrastrar */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-800/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>

              {/* Badge de tipo */}
              <div className="absolute top-2 right-2 bg-blue-600/80 text-white text-xs px-2 py-1 rounded">
                {image.type === 'existing' ? '✓ Guardada' : '🆕 Nueva'}
              </div>

              {/* Controles */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Eliminar */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  title="Eliminar imagen"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>

              {/* Tamaño del archivo (solo para nuevas) */}
              {image.type === 'new' && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {(image.file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-500 italic">
          💡 La primera imagen será la imagen principal de la propiedad. 
          <strong> Arrastra las imágenes</strong> para reordenarlas. 
          Las imágenes con &quot;✓ Guardada&quot; ya están en el servidor, las marcadas con &quot;🆕 Nueva&quot; se subirán al guardar.
        </p>
      )}
    </div>
  );
}
