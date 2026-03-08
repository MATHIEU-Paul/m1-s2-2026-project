import * as fs from 'fs';
import * as path from 'path';

type FolderName = 'authors' | 'books' | 'clients';

export function convertBase64ToBuffer(base64: string): Buffer {
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  return Buffer.from(base64Data, 'base64');
}

export function saveImage(
  base64: string,
  folderName: FolderName,
  id: string,
): string {
  const buffer = convertBase64ToBuffer(base64);
  const filename = `${id}.png`;
  const publicFilePath = `/images/${folderName}/${filename}`;
  const absoluteDirPath = path.join(process.cwd(), 'images', folderName);
  const absoluteFilePath = path.join(absoluteDirPath, filename);

  if (!fs.existsSync(absoluteDirPath)) {
    fs.mkdirSync(absoluteDirPath, { recursive: true });
  }

  fs.writeFileSync(absoluteFilePath, buffer);

  const version = Math.trunc(fs.statSync(absoluteFilePath).mtimeMs);

  return `${publicFilePath}?v=${version}`;
}

export function deleteImage(folderName: FolderName, id: string): void {
  const imagePath = path.join(process.cwd(), 'images', folderName, `${id}.png`);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
}
