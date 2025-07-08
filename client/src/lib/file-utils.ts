export function isValidImageFile(file: File): boolean {
  const validTypes = [
    'image/heic',
    'image/HEIC',
    'image/webp',
    'image/png'
  ];
  
  return validTypes.includes(file.type) || 
         file.name.toLowerCase().endsWith('.heic') ||
         file.name.toLowerCase().endsWith('.webp') ||
         file.name.toLowerCase().endsWith('.png');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}
