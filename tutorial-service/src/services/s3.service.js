// src/services/s3.service.js
// Generates pre-signed S3 URLs for direct browser-to-S3 uploads.
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region:      process.env.AWS_REGION,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET;

/**
 * Generate a pre-signed PUT URL.
 * The browser uploads directly to S3 — our server never touches the file bytes.
 *
 * @param {string} originalFilename — e.g. "photo.png"
 * @param {string} contentType     — e.g. "image/png"
 * @returns {{ uploadUrl: string, publicUrl: string, s3Key: string }}
 */
export const getUploadUrl = async (originalFilename, contentType) => {
  // Build a unique, safe S3 key: tutorials/uploads/<uuid>.<ext>
  const ext    = originalFilename.split(".").pop()?.toLowerCase() || "bin";
  const s3Key  = `tutorials/uploads/${randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         s3Key,
    ContentType: contentType,
  });

  // Pre-signed URL valid for 5 minutes
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  // Public URL (works if bucket has public-read or CloudFront in front)
  const publicUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

  return { uploadUrl, publicUrl, s3Key };
};

/**
 * Delete an object from S3 by key.
 */
export const deleteObject = async (s3Key) => {
  const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: s3Key });
  await s3.send(command);
};
