// utils/schemaUtils.js

export const generateProductListSchema = (metaTitle, metaDescription, canonicalUrl, productosPaginados) => {
  console.log("productos")
  
  console.log(productosPaginados)
  console.log("..")

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": metaTitle,
    "description": metaDescription,
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": productosPaginados.map((producto, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": producto.name,
          "url": `https://tuecomerce.com/productos/${producto.slug || producto.id}`,
           "image": producto.images[0],
                "description": producto.description.substring(0, 160),
                "brand": {
                  "@type": "Brand",
                  "name": producto.brand.namne
                },
                "offers": {
                  "@type": "Offer",
                  "price": producto.price,
                  "priceCurrency": "USD",
                  "priceValidUntil": new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0],
                  "availability": producto.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                  "shippingDetails": {
                    "@type": "OfferShippingDetails",
                    "shippingRate": {
                      "@type": "MonetaryAmount",
                      "value": producto.shipment,
                      "currency": "USD"
                    },
                    "shippingDestination": {
                      "@type": "DefinedRegion",
                      "addressCountry": "US"
                    }
                  }
                },
                "aggregateRating": producto.qualification ? {
                  "@type": "AggregateRating",
                   "ratingValue": producto.qualification.toFixed(1), // ← CAMBIO AQUÍ
                    "reviewCount": 1
                } : undefined
              }
            }))
    }
  };
};

export const generateBreadcrumbsSchema = (canonicalUrl, categoriaSeleccionada) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://tuecomerce.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Productos",
        "item": "https://tuecomerce.com/productos"
      },
      ...(categoriaSeleccionada ? [{
        "@type": "ListItem",
        "position": 3,
        "name": categoriaSeleccionada,
        "item": canonicalUrl
      }] : [])
    ]
  };
};