import { createContext, useContext } from 'react';

// The value should be the full path to the images folder, including the base path and /images
export const ImagePathContext = createContext('/favina-cosmetics/images');

export const useImageBasePath = () => useContext(ImagePathContext);
