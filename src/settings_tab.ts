import { App, PluginSettingTab, Setting } from "obsidian";
import RemotelyImagesPlugin from "./main";

export interface RemotelyImagesPluginSettings {
    region: string;
    accessKeyId: string,
    accessKeySecret: string,
    bucket: string,
    prefix: string;
    host: string;
    rename: string;
}

export const DEFAULT_SETTINGS: RemotelyImagesPluginSettings = {
    region: "oss-cn-beijing",
    accessKeyId: "",
    accessKeySecret: "",
    bucket: "",
    prefix: "",
    host: "",
    rename: "{filename}_{timestamp}.{ext}",
}

export class SampleSettingTab extends PluginSettingTab {
    plugin: RemotelyImagesPlugin;

    constructor(app: App, plugin: RemotelyImagesPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Region')
            .setDesc('region')
            .addText(text => text
                .setPlaceholder('oss-cn-beijing')
                .setValue(this.plugin.settings.region)
                .onChange(async (value) => {
                    this.plugin.settings.region = value;
                    await this.plugin.saveSettings();
                    this.plugin.renewClient();
                }));

        new Setting(containerEl)
            .setName('Access Key ID')
            .setDesc('access_key_id')
            .addText(text => text
                .setPlaceholder('Enter your access_key_id')
                .setValue(this.plugin.settings.accessKeyId)
                .onChange(async (value) => {
                    this.plugin.settings.accessKeyId = value;
                    await this.plugin.saveSettings();
                    this.plugin.renewClient();
                }));

        new Setting(containerEl)
            .setName('Access Key Secret')
            .setDesc('access_key_secret')
            .addText(text => text
                .setPlaceholder('Enter your access_key_secret')
                .setValue(this.plugin.settings.accessKeySecret)
                .onChange(async (value) => {
                    this.plugin.settings.accessKeySecret = value;
                    await this.plugin.saveSettings();
                    this.plugin.renewClient();
                }));

        new Setting(containerEl)
            .setName('Bucket')
            .setDesc('bucket')
            .addText(text => text
                .setPlaceholder('Enter your bucket')
                .setValue(this.plugin.settings.bucket)
                .onChange(async (value) => {
                    this.plugin.settings.bucket = value;
                    await this.plugin.saveSettings();
                    this.plugin.renewClient();
                }));

        new Setting(containerEl)
            .setName('Bucket 设置父目录')
            .setDesc('以 / 结尾，默认为根目录')
            .addText(text => text
                .setPlaceholder('')
                .setValue(this.plugin.settings.prefix)
                .onChange(async (value) => {
                    this.plugin.settings.prefix = value;
                    await this.plugin.saveSettings();
                    this.plugin.renewClient();
                }));

        new Setting(containerEl)
            .setName('设置图片访问的域名')
            .setDesc('可能是CDN的域名')
            .addText(text => text
                .setPlaceholder('')
                .setValue(this.plugin.settings.host)
                .onChange(async (value) => {
                    this.plugin.settings.host = value;
                    await this.plugin.saveSettings();
                    this.plugin.renewClient();
                }));
    }
}