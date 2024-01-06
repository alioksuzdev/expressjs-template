const sharp = require('sharp');
const tmp = require('tmp-promise');
const fs = require('fs/promises');
const fspath = require('path');
const fileType = require('file-type');
const ffprobe = require('ffprobe');
const { path: ffprobePath } = require('ffprobe-static');
const fileAdapter = require('../adapters/fileAdapter');
const postTypes = require('../constants/postTypes');
const InvalidInputError = require('../errors/InvalidInputError');

module.exports = {
  async getImagePlaceholder(buffer) {
    const placeholderBuffer = await sharp(buffer)
      .blur()
      .resize({ width: 10, height: 10 })
      .toBuffer();

    return `data:image/jpeg;base64,${placeholderBuffer.toString('base64')}`;
  },

  async getImageDimensions(buffer) {
    const { height, width } = await sharp(buffer).metadata();
    return { height, width };
  },

  createTmpFile() {
    return tmp.file();
  },

  saveFileBufferToDisk(path, buffer) {
    return fs.writeFile(path, buffer);
  },

  async getVideoMetadata(buffer) {
    const { path, cleanup } = await this.createTmpFile();
    await this.saveFileBufferToDisk(path, buffer);
    const md = await ffprobe(path, { path: ffprobePath });
    cleanup().catch(null);
    console.log(md.streams);
    // eslint-disable-next-line camelcase
    return md.streams.find(({ codec_type }) => codec_type === 'video');
  },

  async prepareVideoAttachments(videos, thumbnails, userId) {
    const attachments = [];
    for (let index = 0; index < videos.length; index += 1) {
      const video = videos[index];
      const videoMimeType = (await fileType.fromBuffer(video.buffer)).mime;
      if (videoMimeType !== 'video/mp4') {
        throw new InvalidInputError();
      }

      const { duration, height, width } = await this.getVideoMetadata(video.buffer);
      if (Math.floor(duration) > 300) throw new InvalidInputError();

      const thumbnail = thumbnails[index];
      const thumbnailMimeType = (await fileType.fromBuffer(thumbnail.buffer)).mime;
      if (thumbnailMimeType !== 'image/jpeg') {
        throw new InvalidInputError();
      }

      attachments.push({
        type: postTypes.VIDEO,
        url: (await fileAdapter.uploadFile(video.buffer, videoMimeType, userId, 'video')).url,
        thumbnail: (await fileAdapter.uploadFile(thumbnail.buffer, thumbnailMimeType, userId, 'thumbnail')).url,
        placeholder: await this.getImagePlaceholder(thumbnail.buffer),
        width,
        height,
        duration: Math.floor(duration),
      });
    }
    return attachments;
  },

  async prepareImageAttachments(images, userId) {
    const attachments = [];
    for (let index = 0; index < images.length; index += 1) {
      const image = images[index];
      if (!image) return attachments;
      const mimeType = (await fileType.fromBuffer(image.buffer)).mime;
      if (mimeType !== 'image/jpeg') {
        throw new InvalidInputError();
      }
      const dimensions = await this.getImageDimensions(image.buffer);
      attachments.push({
        type: postTypes.IMAGE,
        url: (await fileAdapter.uploadFile(image.buffer, mimeType, userId, 'image')).url,
        placeholder: await this.getImagePlaceholder(image.buffer),
        width: dimensions.width,
        height: dimensions.height,
      });
    }
    return attachments;
  },

  createAvatar: null,
  bots: null,
  headerBuffer: null,

  async prepareAvatar(seed, userId) {
    if (!this.createAvatar || !this.bots) {
      this.createAvatar = (await import('@dicebear/core')).createAvatar;
      this.bots = (await import('@dicebear/collection')).botttsNeutral;
    }
    const buffer = Buffer.from(await this.createAvatar(this.bots, { seed }).jpeg().toArrayBuffer());
    return this.prepareImageAttachments([{ buffer }], userId);
  },

  async prepareHeader(userId) {
    if (!this.headerBuffer) {
      this.headerBuffer = await fs.readFile(fspath.join(__dirname, '../assets/default_header.jpg'));
    }
    return this.prepareImageAttachments([{ buffer: this.headerBuffer }], userId);
  },
};
