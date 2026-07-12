"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type SyntheticEvent } from "react";

interface SmartImageProps extends Omit<ImageProps, "onError"> {
  fallbackClassName?: string;
}

export function SmartImage({
  src,
  alt,
  fallbackClassName = "",
  className,
  fill,
  ...props
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  function handleError(_e: SyntheticEvent<HTMLImageElement, Event>) {
    setFailed(true);
  }

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-brand-primary/15 via-brand-secondary/10 to-background ${
          fill ? "absolute inset-0" : ""
        } ${fallbackClassName} ${className ?? ""}`}
        aria-label={alt}
        role="img"
      >
        <span className="text-3xl opacity-30">🎓</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      onError={handleError}
      className={className}
      fill={fill}
      {...props}
    />
  );
}
