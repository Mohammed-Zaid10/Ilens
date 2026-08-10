import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { TryOnView } from "../views/TryOnView";

export const VirtualTryOnModal: React.FC = () => {
  const { isVirtualTryOnOpen, setIsVirtualTryOnOpen, virtualTryOnProduct } = useApp();

  useEffect(() => {
    if (!isVirtualTryOnOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsVirtualTryOnOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVirtualTryOnOpen, setIsVirtualTryOnOpen]);

  if (!isVirtualTryOnOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Virtual Try-On 3D Mirror"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="w-full max-w-6xl my-auto">
        <TryOnView
          isModal={true}
          onCloseModal={() => setIsVirtualTryOnOpen(false)}
          initialProductId={virtualTryOnProduct?.id}
        />
      </div>
    </div>
  );
};
