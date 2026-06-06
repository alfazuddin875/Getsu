export const processImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  if (url.startsWith('/')) return url;
  
  let finalUrl = url;
  
  // Convert Google Drive sharing links to direct image links
  const gdriveRegex = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([^/&\?]+)/;
  const match = url.match(gdriveRegex);
  
  if (match && match[1]) {
    finalUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }

  // To avoid canvas tainting for export, pass through CORS proxy
  // We apply this to all external HTTP images to ensure HTML2Canvas works
  if (finalUrl.startsWith('http') && !finalUrl.includes('corsproxy.io')) {
    return `https://corsproxy.io/?${encodeURIComponent(finalUrl)}`;
  }
  
  return finalUrl;
};
