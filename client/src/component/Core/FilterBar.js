export const bulkActions = [
    { value: "-1", label: "Bulk actions" },
    { value: "edit", label: "Edit" },
    { value: "trash", label: "Move to Trash" },
    { value: "elementor-ai-unify-product-images", label: "Unify with Elementor AI" }
  ];
  
  export const categories = [
    { value: "", label: "Select a category", selected: true },
    { value: "bakery", label: "Bakery", count: 0 },
    { 
      value: "baked-goods", 
      label: "Baked Goods", 
      count: 0,
      indent: 3
    },
    // Add all other categories in the same format
    // ...
  ];
  
  export const productTypes = [
    { value: "", label: "Filter by product type" },
    { value: "simple", label: "Simple product" },
    { value: "downloadable", label: "→ Downloadable", indent: 2 },
    // Add all other product types
    // ...
  ];
  
  export const stockStatuses = [
    { value: "", label: "Filter by stock status" },
    { value: "instock", label: "In stock" },
    { value: "outofstock", label: "Out of stock" },
    { value: "onbackorder", label: "On backorder" }
  ];
  
  export const brands = [
    { value: "", label: "Filter by brand", selected: true }
  ];