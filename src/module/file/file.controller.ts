import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Delete,
  Get,
  Query,
  Body,
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Multer } from "multer";
import { FileService } from "./file.service";
import { File } from "./file.entity";
import { DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { Pagination } from "@/interface/pagination.interface";
import { JwtAuthGuard } from "@/module/auth/jwt-auth.guard";
import { FileDto } from "./dto/file.dto";

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
      },
      fileFilter: (req, file, cb) => {
        // 修复文件名编码（内存操作，占用极低）
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, true);
      },
    })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body("type") type: string
  ): Promise<File> {
    return this.fileService.uploadFile(file, type);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async deleteFile(@Param("id") id: number): Promise<void> {
    return this.fileService.deleteFile(id);
  }

  @Get("type")
  @UseGuards(JwtAuthGuard)
  async getFilesByType(@Query("type") type: string): Promise<File[]> {
    return this.fileService.getFilesByType(type);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getFileList(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
    @Query("type") type?: string
  ): Promise<Pagination<FileDto>> {
    return this.fileService.getFileList({ page, limit }, type);
  }
}
