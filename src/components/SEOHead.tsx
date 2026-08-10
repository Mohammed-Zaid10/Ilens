import React, { useEffect } from "react";
import { ActiveView, Product } from "../types";

interface SEOHeadProps {
  activeView: ActiveView;
  products?: Product[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({ activeView, products = [] }) => {
  useEffect(() => {
    let title = "ILens — Premium Eyewear & Virtual Try-On";
    let description =
      "Discover handcrafted eyeglasses, designer sunglasses, and 3D Virtual Try-On powered by Japanese titanium and AI facial geometry.";
    let image = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1200";
    let jsonLd: object | null = null;

    if (activeView.type === "catalog") {
      title = "ILens — Shop Eyeglasses, Sunglasses & Premium Frames";
      description = "Browse our luxury collection of prescription optical frames, Japanese beta-titanium glasses, and UV400 sunglasses.";
    } else if (activeView.type === "product-detail") {
      const product = products.find((p) => p.id === activeView.productId);
      if (product) {
        title = `${product.name} — ILens Premium Eyewear`;
        description = product.description || `Shop ${product.name} handcrafted eyewear with prescription lenses, anti-reflective coating, and 3D Virtual Try-On.`;
        image = product.primaryImage;

        jsonLd = {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": product.name,
          "image": product.primaryImage,
          "description": product.description,
          "brand": {
            "@type": "Brand",
            "name": product.brand || "ILens",
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": product.price,
            "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
              "@type": "Organization",
              "name": "ILens Eyewear Atelier",
            },
          },
        };
      }
    } else if (activeView.type === "try-on") {
      title = "ILens — 3D Real-Time Virtual Try-On Mirror";
      description = "Try on luxury eyeglasses virtually using live 3D face mesh camera tracking before you buy.";
    } else if (activeView.type === "stores") {
      title = "ILens — Find an Optical Store & Atelier Near You";
      description = "Visit an ILens optical store for comprehensive eye exams, frame styling, and custom lens fitting.";
    } else if (activeView.type === "account") {
      title = "ILens — Customer Account & Prescriptions";
      description = "Manage your optical prescriptions, track active eyewear orders, and save shipping addresses securely.";
    } else if (activeView.type === "checkout") {
      title = "ILens — Secure Checkout & Order Customization";
      description = "Complete your eyewear purchase with insured express shipping and prescription customization.";
    } else if (activeView.type === "static-page") {
      const slugTitles: Record<string, string> = {
        about: "ILens — About Our Japanese Heritage & Craftsmanship",
        shipping: "ILens — Insured Express Global Shipping Policy",
        returns: "ILens — 30-Day Risk-Free Returns & Lens Adaption Guarantee",
        warranty: "ILens — 1-Year Comprehensive Frame & Lens Warranty",
        privacy: "ILens — Privacy & HIPAA-Grade Optical Security Policy",
        terms: "ILens — Terms of Service & Customer Guarantee",
        help: "ILens — Optical Help Center & Frequently Asked Questions",
        contact: "ILens — Contact Our Optical Concierge & Opticians",
      };
      if (slugTitles[activeView.pageSlug]) {
        title = slugTitles[activeView.pageSlug];
      }
    }

    // Set Document Title
    document.title = title;

    // Helper to update/create meta tag
    const updateMeta = (selector: string, attrName: string, attrVal: string, contentVal: string) => {
      let tag = document.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attrName, attrVal);
        document.head.appendChild(tag);
      }
      tag.content = contentVal;
    };

    updateMeta('meta[name="description"]', 'name', 'description', description);
    updateMeta('meta[property="og:title"]', 'property', 'og:title', title);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', description);
    updateMeta('meta[property="og:image"]', 'property', 'og:image', image);
    updateMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    updateMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    // Organization Schema
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ILens Eyewear Atelier",
      "url": window.location.origin,
      "logo": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=500",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-555-4536",
        "contactType": "customer service",
        "areaServed": "US",
        "availableLanguage": "English",
      },
    };

    let scriptTag = document.getElementById("ilens-jsonld") as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "ilens-jsonld";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(jsonLd || orgSchema);
  }, [activeView, products]);

  return null;
};
