"use client"

import { useState } from "react"
import Image, { ImageProps } from "next/image"
import { Compass } from "lucide-react"

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
  fallbackTitle?: string
}

export function SafeImage({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
  fallbackTitle,
  className,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-primary/30 via-slate-800 to-amber-950/40 text-white p-4 overflow-hidden ${className || "h-full w-full"}`}>
        <div className="text-center z-10 space-y-1">
          <Compass className="h-8 w-8 text-primary mx-auto animate-pulse" />
          <p className="text-xs font-bold tracking-tight text-white/90 drop-shadow-sm">{fallbackTitle || alt || "India Destination"}</p>
        </div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
      </div>
    )
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      unoptimized
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc)
        } else {
          setHasError(true)
        }
      }}
    />
  )
}
