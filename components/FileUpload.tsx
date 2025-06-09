"use client";
import { Image, Video, upload, ImageKitProvider } from "@imagekit/next";
import NextImage from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import config from "@/lib/config";
import { cn } from "@/lib/utils";

const {
  env: {
    imagekit: { urlEndpoint },
  },
} = config;

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

export default function FileUpload({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string | null>(value ?? null);

  const getAuth = async () => {
    const res = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Authentication request failed: ${errorText}`);
    }
    return res.json() as Promise<{
      signature: string;
      token: string;
      expire: number;
      publicKey: string;
    }>;
  };

  const validate = (file: File) => {
    const limitMB = type === "video" ? 50 : 20;
    if (file.size > limitMB * 1024 * 1024) {
      toast("File too large", {
        description: `Максимум ${limitMB} MB`,
      });
      return false;
    }
    return true;
  };

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validate(file)) return;

    let auth;
    try {
      auth = await getAuth();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast("Auth failed", { description: message });
      return;
    }

    try {
      const { url, filePath } = await upload({
        file,
        fileName: file.name,
        folder,
        useUniqueFileName: true,
        signature: auth.signature,
        token: auth.token,
        expire: auth.expire,
        publicKey: auth.publicKey,
        onProgress: (ev) => setProgress(Math.round((ev.loaded * 100) / ev.total)),
      });

      if (!filePath) throw new Error("No filePath returned");

      if (typeof url === "string") setFileUrl(url);
      onFileChange(filePath);

      toast(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded`, {
        className: "bg-gray-800 text-white",
      });
      setProgress(0);
    } catch (err: unknown) {
      console.error(err);
      toast("Upload failed", {
        description: err instanceof Error ? err.message : "Спробуйте ще раз",
      });
      setProgress(0);
    }
  };

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300 text-light-100"
        : "bg-light-600 border border-gray-100 text-dark-400",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
  };

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        className="hidden"
        onChange={handleSelect}
        onClick={(e) => ((e.target as HTMLInputElement).value = "")}
      />

      <button
        type="button"
        className={cn("upload-btn", styles.button)}
        onClick={() => fileInputRef.current?.click()}
      >
        <NextImage
          src="/icons/upload.svg"
          className="object-contain"
          alt="upload-icon"
          width={20}
          height={20}
        />
        {placeholder}
      </button>

      {progress > 0 && progress < 100 && (
        <progress value={progress} max={100} className="w-full">
          {progress}%
        </progress>
      )}

      {fileUrl &&
        (type === "image" ? (
          <Image src={fileUrl} alt="preview" width={500} height={300} />
        ) : (
          <Video src={fileUrl} controls className="h-96 w-full rounded-xl" />
        ))}
    </ImageKitProvider>
  );
}
