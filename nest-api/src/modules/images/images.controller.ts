import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('images')
export class ImagesController {
  @Get(':folder/:filename')
  getImage(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const allowedFolders = ['books', 'authors', 'clients'];

    if (!allowedFolders.includes(folder)) {
      throw new NotFoundException('Folder not found');
    }

    const imagePath = path.join(process.cwd(), 'images', folder, filename);

    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException('Image not found');
    }

    const ext = path.extname(filename).toLowerCase();
    const contentType =
      {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
      }[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);
  }
}
