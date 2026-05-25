import React from "react";
import * as Icons from "lucide-react";

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export function Icon({ name, className = "", size }: IconProps) {
  // Safe fallback to Scissors if icon name doesn't match
  const LucideIcon = (Icons as any)[name];
  
  if (!LucideIcon) {
    return <Icons.Scissors className={className} size={size} />;
  }
  
  return <LucideIcon className={className} size={size} />;
}
