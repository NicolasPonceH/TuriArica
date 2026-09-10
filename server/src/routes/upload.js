import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const photosDir = path.resolve(__dirname, '../../uploads/photos');
const videosDir = path.resolve(__dirname, '../../uploads/videos');

[photosDir, videosDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Configure Multer for in-memory buffer (so sharp can process before saving)
const photoStorage = multer.memoryStorage();
const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max input
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, WEBP, etc.)'));
    }
  }
});

// Configure Multer for Video disk storage
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videosDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const ext = path.extname(file.originalname).toLowerCase() || '.mp4';
    cb(null, `video-${uniqueSuffix}${ext}`);
  }
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 60 * 1024 * 1024 }, // 60MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de video (MP4, WEBM, MOV)'));
    }
  }
});

// 1. Subida y Optimización de Foto (WebP + Thumbnail)
router.post('/photo', requireAuth, uploadPhoto.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo de imagen.' });
    }

    const originalSize = req.file.size;
    const uniqueId = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const webpFilename = `photo-${uniqueId}.webp`;
    const thumbFilename = `photo-${uniqueId}-thumb.webp`;

    const webpPath = path.join(photosDir, webpFilename);
    const thumbPath = path.join(photosDir, thumbFilename);

    // Optimización WebP Full HD (máx 1920x1080)
    await sharp(req.file.buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(webpPath);

    // Miniatura WebP para carga instantánea (400x300)
    await sharp(req.file.buffer)
      .resize(400, 300, { fit: 'cover', position: 'center' })
      .webp({ quality: 78 })
      .toFile(thumbPath);

    const optimizedSize = fs.statSync(webpPath).size;
    const thumbSize = fs.statSync(thumbPath).size;
    const savingsPercent = Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100));

    res.json({
      message: 'Foto optimizada y guardada exitosamente.',
      url: `/uploads/photos/${webpFilename}`,
      thumbUrl: `/uploads/photos/${thumbFilename}`,
      format: 'webp',
      stats: {
        originalKb: (originalSize / 1024).toFixed(1),
        optimizedKb: (optimizedSize / 1024).toFixed(1),
        thumbKb: (thumbSize / 1024).toFixed(1),
        savingsPercent: `${savingsPercent}%`
      }
    });
  } catch (error) {
    console.error('Error al optimizar imagen:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar y optimizar la imagen.' });
  }
});

// 2. Subida de Video Web Optimizado
router.post('/video', requireAuth, uploadVideo.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo de video.' });
    }

    const videoUrl = `/uploads/videos/${req.file.filename}`;
    res.json({
      message: 'Video subido exitosamente.',
      url: videoUrl,
      filename: req.file.filename,
      sizeMb: (req.file.size / (1024 * 1024)).toFixed(2),
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Error al subir video:', error);
    res.status(500).json({ error: 'Error al procesar el archivo de video.' });
  }
});

export default router;
