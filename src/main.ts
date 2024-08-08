import { Editor, MarkdownView, Plugin } from 'obsidian';
import { SampleSettingTab, DEFAULT_SETTINGS, RemotelyImagesPluginSettings } from './settings_tab';
import { OssClient } from './oss';
import * as path from 'path';
import { randomUUID } from 'crypto';

export default class RemotelyImagesPlugin extends Plugin {
	settings: RemotelyImagesPluginSettings;
	ossClient: OssClient;

	renewClient() {
		this.ossClient = new OssClient(this.settings);
	}

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.renewClient();

		this.registerEvent(this.app.workspace.on('editor-paste', this.customPasteEventCallback.bind(this)))
		// this.registerEvent(this.app.workspace.on('editor-drop', this.customDropEventListener))


		// // This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('This is a notice!');
		// });
		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// // This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// // Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	async customPasteEventCallback(e: ClipboardEvent, editor: Editor, markdownView: MarkdownView) {
		const { files } = e.clipboardData!;
		console.log(files);
		e.preventDefault();

		for (let i = 0; i < files.length; i++) {
			const filename = this.formatFilename(this.settings.rename, files[i].name);
			let url = await this.uploadFile(filename, files[i]);
			// editor.setValue(`![${filename}](${url})`);
			editor.replaceRange(`![${filename}](${url})`, editor.getCursor());
		}
	}

	formatFilename(format: string, filename: string) {
		const date = new Date();
		const idx = filename.lastIndexOf('.');
		const file = filename.substring(0, idx);
		const ext = filename.substring(idx + 1);
		format = format.replace(/\{filename\}/g, file);
		format = format.replace(/\{ext\}/g, ext);
		format = format.replace(/\{timestamp\}/g, date.getTime().toString());
		format = format.replace(/\{YYYY\}/g, date.getFullYear().toString());
		format = format.replace(/\{MM\}/g, (date.getMonth() + 1).toString());
		format = format.replace(/\{DD\}/g, date.getDate().toString());
		format = format.replace(/\{HH\}/g, date.getHours().toString());
		format = format.replace(/\{mm\}/g, date.getMinutes().toString());
		format = format.replace(/\{ss\}/g, date.getSeconds().toString());
		format = format.replace(/\{UUID\}/g, randomUUID().toString());
		return format;
	}

	async uploadFile(filename: string, file: File) {
		filename = path.posix.join(this.settings.prefix, filename);
		await this.ossClient.uploadFile(filename, file)

		return path.posix.join(this.settings.host, filename);

	}

	// async customDropEventListener() {

	// }

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
