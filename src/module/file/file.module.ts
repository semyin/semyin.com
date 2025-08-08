import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { File } from "./file.entity";
import { CosService } from "./cos.service";

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [FileController],
  providers: [FileService, CosService],
})
export class FileModule {}
