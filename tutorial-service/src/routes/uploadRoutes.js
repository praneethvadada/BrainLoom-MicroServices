import express from "express";
import multer from "multer";
import { serverUploadHandler } from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/server", upload.any(), serverUploadHandler);

export default router;



// import express from "express";
// import { presignForUpload } from "../controllers/uploadController.js";
// import { authenticate } from "../middleware/authMiddleware.js";
// import { requireAdmin } from "../middleware/roleMiddleware.js";

// const router = express.Router();
// router.post("/presign", authenticate, requireAdmin, presignForUpload);
// export default router;
