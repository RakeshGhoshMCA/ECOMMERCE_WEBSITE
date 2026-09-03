export const apiUrl = (path = '') => `${import.meta.env.VITE_DJANGO_BASE_URL}${path}`;

export const productImage = (image) => {
  if (!image) return null;
  return image.startsWith('http') ? image : apiUrl(image);
};

export const formatPrice = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
