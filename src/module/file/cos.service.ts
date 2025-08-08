import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import COS from "cos-nodejs-sdk-v5";

@Injectable()
export class CosService {
  private cos: COS;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    const bucket = this.configService.get<string>("TENCENT_COS_BUCKET");
    const region = this.configService.get<string>("TENCENT_COS_REGION");
    const secretId = this.configService.get<string>("TENCENT_COS_SECRET_ID");
    const secretKey = this.configService.get<string>("TENCENT_COS_SECRET_KEY");

    if (!bucket || !region || !secretId || !secretKey) {
      throw new Error(
        "Missing required environment variables for COS configuration"
      );
    }
    this.bucket = bucket;
    this.region = region;
    this.cos = new COS({
      SecretId: this.configService.get<string>("TENCENT_COS_SECRET_ID"),
      SecretKey: this.configService.get<string>("TENCENT_COS_SECRET_KEY"),
    });
  }

  async uploadFile(key: string, body: Buffer): Promise<string> {
    await this.cos.putObject({
      Bucket: this.bucket,
      Region: this.region,
      Key: key,
      Body: body,
    });
    return `https://${this.bucket}.cos.${this.region}.myqcloud.com/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    await this.cos.deleteObject({
      Bucket: this.bucket,
      Region: this.region,
      Key: key,
    });
  }
}
