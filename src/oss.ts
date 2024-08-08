const OSS = require('ali-oss');
import { RemotelyImagesPluginSettings } from './settings_tab';

export class OssClient {
    client: any

    constructor(settings: RemotelyImagesPluginSettings) {
        this.client = new OSS({
            region: settings.region,
            accessKeyId: settings.accessKeyId,
            accessKeySecret: settings.accessKeySecret,
            bucket: settings.bucket,
            authorizationV4: true,
        })
    }

    async uploadFile(filename: string, file: File) {
        try {
            await this.client.put(filename, file);
        } catch (error) {
            console.error('UploadFile Fail:', error);
            throw error;
        }
    }
}
