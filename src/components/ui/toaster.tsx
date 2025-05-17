
"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="bottom-right"
      closeButton
      richColors
      theme="light"
      expand={false}
      duration={4000}
      // Removing 'dismissible' prop as it's not supported in the library's types
      style={{
        zIndex: 999999,
      }}
    />
  );
}
