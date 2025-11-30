// Safely get site origin for metadata
function getSiteOrigin(): string {
  // Try NEXT_PUBLIC_SITE_URL first
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL).origin;
    } catch {
      // If invalid URL, return as-is (might be just domain)
      return process.env.NEXT_PUBLIC_SITE_URL;
    }
  }
  
  // Fallback to VERCEL_URL (automatically set by Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Default fallback
  return 'https://localhost:3000';
}

export const siteOrigin = getSiteOrigin();

// For runtime use
export const siteURL = typeof window !== 'undefined' 
  ? new URL(window.location.href)
  : (() => {
      try {
        return new URL(siteOrigin);
      } catch {
        // Fallback if siteOrigin is not a valid URL
        return new URL('https://localhost:3000');
      }
    })();
