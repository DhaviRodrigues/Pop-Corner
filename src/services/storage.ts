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
  folder: 'perfil_foto' | 'cinema_foto' | 'filme_foto', 
  identifier: string,
  fileName?: string
): Promise<{ success: boolean; signedUrl?: string; path?: string; error?: string }> {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    
    const fileExtension = fileName?.split('.').pop()?.split('?')[0].toLowerCase() || 'jpg';
    const filePath = `${folder}/${identifier}/${Date.now()}.${fileExtension}`;

    const { data, error: uploadError } = await supabase.storage
      .from(folder)
      .upload(filePath, blob, {
        contentType: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: signedData, error: signedError } = await supabase.storage
      .from(folder)
      .createSignedUrl(data.path, 2592000);

    if (signedError) throw signedError;

    return {
      success: true,
      path: data.path,
      signedUrl: signedData.signedUrl,
    };
  } catch (error: any) {
    console.error("Erro no upload para Supabase:", error);
    return { success: false, error: error.message };
  }
}

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