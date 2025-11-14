"use client";

interface UploadProgressBarProps {
  current: number;
  total: number;
  currentFileName?: string;
  stage?: "compressing" | "uploading" | "completed" | "error";
  error?: string;
  compressionStats?: {
    originalSize: number;
    compressedSize: number;
    reduction: number;
  };
}

export default function UploadProgressBar({
  current,
  total,
  currentFileName,
  stage = "uploading",
  error,
  compressionStats,
}: UploadProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const getStageText = () => {
    switch (stage) {
      case "compressing":
        return "Comprimiendo imágenes...";
      case "uploading":
        return "Subiendo imágenes...";
      case "completed":
        return "¡Carga completada!";
      case "error":
        return "Error en la carga";
      default:
        return "Procesando...";
    }
  };

  const getStageColor = () => {
    switch (stage) {
      case "compressing":
        return "bg-yellow-500";
      case "uploading":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full bg-white border-2 border-gray-200 rounded-lg p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {stage === "uploading" && (
            <svg
              className="animate-spin h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
            >
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
          )}
          {stage === "compressing" && (
            <svg
              className="animate-pulse h-6 w-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          )}
          {stage === "completed" && (
            <svg
              className="h-6 w-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {stage === "error" && (
            <svg
              className="h-6 w-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          <span className="text-lg font-semibold text-gray-900">
            {getStageText()}
          </span>
        </div>
        <span className="text-2xl font-bold text-gray-900">
          {current}/{total}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
        <div
          className={`h-full ${getStageColor()} transition-all duration-300 ease-out flex items-center justify-end pr-2`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && (
            <span className="text-xs font-bold text-white">{percentage}%</span>
          )}
        </div>
      </div>

      {/* Current File */}
      {currentFileName && (
        <div className="text-sm text-gray-600 mb-2 truncate">
          📁 {currentFileName}
        </div>
      )}

      {/* Compression Stats */}
      {compressionStats && stage === "compressing" && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-yellow-700 font-medium">
              💾 Reducción: {compressionStats.reduction}%
            </span>
            <span className="text-yellow-600">
              ({formatBytes(compressionStats.originalSize)} →{" "}
              {formatBytes(compressionStats.compressedSize)})
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">⚠️ {error}</p>
        </div>
      )}

      {/* Completion Message */}
      {stage === "completed" && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">
            ✓ Todas las imágenes se subieron correctamente
          </p>
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
