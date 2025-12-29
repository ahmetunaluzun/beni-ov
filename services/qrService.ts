// QR Code generator using external API (ücretsiz)
export const generateQRCode = async (text: string): Promise<string> => {
  const size = 300;
  const encodedText = encodeURIComponent(text);
  
  // QR Server API kullanarak (ücretsiz, limit yok)
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&format=png`;
  
  return url;
};

// QR kod ile paylaşılabilir link oluşturma
export const createShareableLink = (praise: string): string => {
  const baseUrl = window.location.origin;
  const encodedPraise = encodeURIComponent(praise);
  
  // URL'ye övgü parametresi ekle
  return `${baseUrl}?shared=${encodedPraise}`;
};

// URL'den paylaşılan övgüyü al
export const getSharedPraiseFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  const sharedPraise = params.get('shared');
  
  if (sharedPraise) {
    return decodeURIComponent(sharedPraise);
  }
  
  return null;
};

// QR kod indirme fonksiyonu
export const downloadQRCode = async (imageUrl: string, fileName: string = 'beni-ov-qr.png') => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('QR kod indirme hatası:', error);
    throw new Error('QR kod indirilemedi');
  }
};
