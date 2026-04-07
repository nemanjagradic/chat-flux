import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  updates: Record<string, string>,
  photo: File,
) {
  const buffer = Buffer.from(await photo.arrayBuffer());

  const uploadResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) reject(error);
        else resolve(result as UploadApiResponse);
      });
      stream.end(buffer);
    },
  );

  updates.photo = uploadResult.secure_url;
}
