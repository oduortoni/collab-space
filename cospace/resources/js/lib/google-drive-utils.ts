/**
 * Utility functions for handling Google Drive URLs and image proxy
 */

/**
 * Gets the appropriate image URL, using proxy for Google Drive URLs to avoid CORS issues
 * @param imageUrl The image URL (can be regular URL or Google Drive URL)
 * @returns URL to use for the image (either original or proxied)
 */
export function getImageUrl(imageUrl: string): string {
  // Check if this is a Google Drive URL
  if (isGoogleDriveUrl(imageUrl)) {
    // Use proxy for Google Drive URLs to avoid CORS issues
    return `/image-proxy?url=${encodeURIComponent(convertGoogleDriveUrlToDirectImage(imageUrl))}`;
  }
  
  // For non-Google Drive URLs, use directly
  return imageUrl;
}

/**
 * Converts a Google Drive file URL to a direct image URL
 * @param googleDriveUrl The Google Drive file URL
 * @returns Direct image URL or original URL if not a Google Drive URL
 */
export function convertGoogleDriveUrlToDirectImage(googleDriveUrl: string): string {
  // Check if this is a Google Drive URL
  if (!googleDriveUrl.includes('drive.google.com/file/d/')) {
    return googleDriveUrl;
  }

  try {
    // Extract the file ID from the Google Drive URL
    const url = new URL(googleDriveUrl);
    const pathParts = url.pathname.split('/');
    const fileIdIndex = pathParts.indexOf('d') + 1;
    
    if (fileIdIndex > 0 && fileIdIndex < pathParts.length) {
      const fileId = pathParts[fileIdIndex];
      
      // Return the direct image URL for Google Drive
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  } catch (error) {
    console.error('Error converting Google Drive URL:', error);
  }

  // Return original URL if conversion fails
  return googleDriveUrl;
}

/**
 * Checks if a URL is a Google Drive URL
 * @param url The URL to check
 * @returns boolean indicating if it's a Google Drive URL
 */
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com/file/d/');
}
