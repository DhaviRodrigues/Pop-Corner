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
    const fileExtension = fileUri.split('.').pop()?.split('?')[0] || '';
    const normalizedExtension = fileExtension.toLowerCase();

    if (!ALLOWED_IMAGE_EXTENSIONS.includes(normalizedExtension)) {
      return {
        success: false,
        error: 'Formato inválido. Use apenas JPG, JPEG ou PNG.',
      };
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