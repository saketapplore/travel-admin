// Predefined property photo categories (Point 8). Must match the backend list
// in travel_rumour_backend/src/modules/tr-stays/constants/photoCategories.ts
export const PHOTO_CATEGORIES = [
  'Living Room',
  'Full Kitchen',
  'Dining Area',
  'Bedroom 1',
  'Bedroom 2',
  'Bedroom 3',
  'Full Bathroom 1',
  'Full Bathroom 2',
  'Balcony 1',
  'Balcony 2',
  'Workplace',
  'Additional Photos'
];

// Flatten categorized photos into a single ordered URL list.
export const flattenCategoryImages = (photoCategories = []) =>
  (Array.isArray(photoCategories) ? photoCategories : [])
    .flatMap((c) => (Array.isArray(c?.images) ? c.images : []))
    .filter((u) => typeof u === 'string' && u.trim());

// Seed category data when editing a property that only has the legacy flat
// `images` array — drop them all under "Additional Photos" so nothing is lost.
export const seedPhotoCategories = (photoCategories, flatImages) => {
  if (Array.isArray(photoCategories) && photoCategories.length > 0) return photoCategories;
  if (Array.isArray(flatImages) && flatImages.length > 0) {
    return [{ category: 'Additional Photos', description: '', images: flatImages }];
  }
  return [];
};
