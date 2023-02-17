import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  userPlceholder = {
    link: 'user_placeholder.jpg',
    id: '63e36cbdd6eaff21257f4c8d',
  };
  async createFile(file: Express.Multer.File): Promise<string> {
    this.validate(file);
    try {
      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '..', '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      throw new HttpException(
        'An error occurred while writing the file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  validate(file: Express.Multer.File): void {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg') {
      throw new HttpException(
        'Only .jpg files are allowed!',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (file.size > 5000000) {
      throw new HttpException(
        'File size must be less than 5 megabytes!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
