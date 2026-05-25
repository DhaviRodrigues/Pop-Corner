import { supabase } from '@/config/supabase';

export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

interface UploadResponse {
  success: boolean;
  path?: string;
  signedUrl?: string;
  error?: string;
}

export async function uploadUserPhoto(
  fileUri: string, 
  folder: 'perfil_foto' | 'cinema_foto' |'filme_foto', 
  identifier: string
): Promise<UploadResponse> {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    
    // Tentar extrair extensão da URI
    let fileExtension = fileUri.split('.').pop()?.split('?')[0] || '';
    let normalizedExtension = fileExtension.toLowerCase();

    // Se extensão não for válida, tentar extrair do blob.type (mime type)
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(normalizedExtension)) {
      const mimeType = blob.type.toLowerCase();
      if (mimeType.includes('png')) {
        normalizedExtension = 'png';
      } else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
        normalizedExtension = 'jpg';
      } else {
        return {
          success: false,
          error: 'Formato inválido. Use apenas JPG, JPEG ou PNG.',
        };
      }
    }

    const cleanExtension = normalizedExtension;
    const filePath = `${identifier}.${cleanExtension}`;

    const { data, error: uploadError } = await supabase.storage
      .from(folder)
      .upload(filePath, blob, {
        contentType: `image/${cleanExtension}`,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: signedData, error: signedError } = await supabase.storage
      .from(folder)
      .createSignedUrl(filePath, 2592000);

    if (signedError) throw signedError;

    return {
      success: true,
      path: data.path,
      signedUrl: signedData.signedUrl,
    }
};

export async function getPhotoUrl(
    filePath: string,
    folder: 'perfil_foto' | 'cinema_foto' |'filme_foto'
    ): Promise<string | null> {

  if (!filePath) return null;
  const { data, error } = await supabase.storage
    .from(folder)
    .createSignedUrl(filePath, 2592000);

  if (error) return null;
  return data?.signedUrl ?? null;

}