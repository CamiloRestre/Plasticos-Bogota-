"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";

export default function ImageUploader({ initialUrl, onFile }: { initialUrl?: string | null; onFile: (file: File | null) => void }) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFile(file);
  }, [onFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] }, maxFiles: 1, maxSize: 8 * 1024 * 1024 });
  useEffect(() => () => { if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);
  return (
    <div className="admin-image-uploader">
      {preview ? <div className="admin-image-preview"><img src={preview} alt="Vista previa del producto" /><button type="button" onClick={() => { setPreview(null); onFile(null); }} aria-label="Quitar imagen"><X size={18} /></button></div> : <div {...getRootProps()} className={`admin-dropzone ${isDragActive ? "is-dragging" : ""}`}><input {...getInputProps()} /><ImagePlus size={24} /><strong>{isDragActive ? "Suelta la imagen aquí" : "Arrastra una imagen o haz clic"}</strong><span>JPG, PNG o WebP · máximo 8 MB</span></div>}
    </div>
  );
}
