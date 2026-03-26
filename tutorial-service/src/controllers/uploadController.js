// src/controllers/uploadController.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import * as ContentBlock from "../models/contentBlockModel.js";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function generateFileKey(originalName) {
  const ext = originalName.split(".").pop();
  const hash = crypto.randomBytes(8).toString("hex");
  return `uploads/${Date.now()}-${hash}.${ext}`;
}

export const serverUploadHandler = async (req, res) => {
  console.log("🔥 serverUploadHandler called");
  console.log("Body fields:", req.body);

  try {
    let components = [];
    if (req.body.components) {
      try {
        components = JSON.parse(req.body.components);
      } catch {
        console.warn("⚠️ Invalid JSON for components, ignoring");
      }
    }

    const uploadedFiles = [];

    // Upload each file to S3
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileKey = generateFileKey(file.originalname);
        console.log(`📂 Uploading ${file.originalname} → ${fileKey}`);

        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        await s3.send(new PutObjectCommand(uploadParams));

        const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
        uploadedFiles.push({ key: fileKey, url: publicUrl, mime: file.mimetype });

        // replace fileKey in components
        for (const c of components) {
          if (c.fileKey && c.fileKey === file.fieldname) {
            c.url = publicUrl;
            delete c.fileKey;
          }
        }
      }
    }

    // ✅ Return only URLs + updated components
    return res.status(200).json({
      message: "Upload successful",
      files: uploadedFiles,
      components,
    });

  } catch (err) {
    console.error("❌ Upload error:", err);
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
};


// export const serverUploadHandler = async (req, res) => {
//   console.log("🔥 serverUploadHandler called");
//   console.log("Body fields:", req.body);

//   try {
//     // Parse components JSON
//     let components = [];
//     if (req.body.components) {
//       try {
//         components = JSON.parse(req.body.components);
//       } catch {
//         console.warn("⚠️ Invalid JSON for components, ignoring");
//       }
//     }

//     // Upload each file to S3
//     const uploadedFiles = [];
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         const fileKey = generateFileKey(file.originalname);
//         console.log(`📂 Uploading ${file.originalname} → ${fileKey}`);

//         const uploadParams = {
//           Bucket: process.env.AWS_S3_BUCKET,
//           Key: fileKey,
//           Body: file.buffer,
//           ContentType: file.mimetype,
//         };
//         await s3.send(new PutObjectCommand(uploadParams));

//         const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
//         uploadedFiles.push({ key: fileKey, url: publicUrl, mime: file.mimetype });

//         // Update any component with matching fileKey
//         for (const c of components) {
//           if (c.fileKey && c.fileKey === file.fieldname) {
//             c.url = publicUrl;
//             delete c.fileKey;
//           }
//         }
//       }
//     }

//     // ✅ Now insert the content into DB
//     if (req.body.topic_id) {
//       const payload = {
//         topic_id: Number(req.body.topic_id),
//         block_type: req.body.block_type || "page",
//         components,
//         block_order: req.body.block_order || 0,
//         metadata: req.body.metadata ? JSON.parse(req.body.metadata) : null,
//       };

//       const result = await ContentBlock.createBlock(payload);
//       return res.status(201).json({ id: result.id, message: "Content block created" });
//     }

//     // If no topic_id — just return upload info
//     return res.status(200).json({
//       message: "Upload successful",
//       files: uploadedFiles,
//       components,
//     });
//   } catch (err) {
//     console.error("❌ Upload error:", err);
//     return res.status(500).json({ message: "Upload failed", error: err.message });
//   }
// };



// // src/controllers/uploadController.js
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import crypto from "crypto";

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// function generateFileKey(originalName) {
//   const ext = originalName.split(".").pop();
//   const hash = crypto.randomBytes(8).toString("hex");
//   return `uploads/${Date.now()}-${hash}.${ext}`;
// }

// export const serverUploadHandler = async (req, res) => {
//   console.log("🔥 serverUploadHandler called");
//   console.log("Body fields:", req.body);
//   console.log(
//     "Files received:",
//     req.files?.map(f => ({
//       fieldname: f.fieldname,
//       originalname: f.originalname,
//       mimetype: f.mimetype,
//       size: f.size,
//     }))
//   );

//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "No files provided" });
//     }

//     const uploadedFiles = [];
//     for (const file of req.files) {
//       const fileKey = generateFileKey(file.originalname);
//       console.log(`📂 Uploading to S3 as ${fileKey} ...`);

//       const uploadParams = {
//         Bucket: process.env.AWS_S3_BUCKET,
//         Key: fileKey,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       };

//       await s3.send(new PutObjectCommand(uploadParams));

//       const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
//       uploadedFiles.push({
//         key: fileKey,
//         url: publicUrl,
//         mime: file.mimetype,
//       });

//       console.log(`✅ Uploaded ${file.originalname} → ${publicUrl}`);
//     }

//     return res.status(200).json({
//       message: "Upload successful",
//       files: uploadedFiles,
//     });
//   } catch (err) {
//     console.error("❌ Upload error:", err);
//     return res.status(500).json({ message: "Upload failed", error: err.message });
//   }
// };



// // // src/controllers/uploadController.js
// // import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// // import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// // import crypto from "crypto";

// // const s3 = new S3Client({
// //   region: process.env.AWS_REGION,
// //   credentials: {
// //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// //   },
// // });

// // function randomFileName(origName) {
// //   const ext = (origName && origName.includes(".")) ? origName.split(".").pop() : "";
// //   const id = crypto.randomBytes(12).toString("hex");
// //   return ext ? `${id}.${ext}` : id;
// // }

// // /**
// //  * POST /api/upload/presign
// //  * body: { filename?: string, contentType: "image/png", folder?: "topics/42" }
// //  * returns: { uploadUrl, publicUrl, key }
// //  */
// // export const presignForUpload = async (req, res) => {
// //   try {
// //     const { filename, contentType, folder } = req.body || {};
// //     if (!contentType) return res.status(400).json({ message: "contentType required" });

// //     const bucket = process.env.S3_BUCKET;
// //     if (!bucket) return res.status(500).json({ message: "S3 bucket not configured" });

// //     const fname = filename ? filename.replace(/\s+/g, "_") : randomFileName(filename);
// //     const key = (folder ? `${folder.replace(/^\/+|\/+$/g, "")}/` : "") + fname;

// //     // optional metadata and ACL here; we rely on bucket policy/CloudFront for public access
// //     const command = new PutObjectCommand({
// //       Bucket: bucket,
// //       Key: key,
// //       ContentType: contentType,
// //       // ACL: "public-read", // avoid; use bucket policy or CloudFront
// //       CacheControl: "public, max-age=31536000, immutable"
// //     });

// //     // presigned url valid for N seconds (e.g., 300)
// //     const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

// //     // public URL (if objects are public or via CloudFront)
// //     let publicUrl;
// //     if (process.env.CLOUDFRONT_DOMAIN) {
// //       publicUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`;
// //     } else {
// //       publicUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
// //     }

// //     return res.json({ uploadUrl: signedUrl, publicUrl, key });
// //   } catch (err) {
// //     console.error("presignForUpload error:", err);
// //     return res.status(500).json({ message: "Failed to generate presigned url" });
// //   }
// // };
