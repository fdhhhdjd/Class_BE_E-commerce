const mediaConstants = require("../../share/constants/media.constants");
const cloudinary = require("../../share/database/cloudinary.database");

class MediaService {
  async getMedia(publicId) {
    if (!publicId) {
      throw new Error("PublicId not found");
    }

    const media = await cloudinary.api.resource(publicId);

    return {
      message: "Media found",
      data: media,
    };
  }

  async uploadSingle(req) {
    const file = req.file;

    if (!file) {
      throw new Error("File not found");
    }

    const fileBase64 = file.buffer.toString("base64");
    const fileUri = `data:${file.mimetype};base64,${fileBase64}`;

    const result = await cloudinary.uploader.upload(fileUri, {
      folder: mediaConstants.Folder,
    });

    return {
      message: "Upload success",
      data: {
        publicId: result.public_id,
        url: result.secure_url,
      },
    };
  }

  async uploadMultiple(req) {
    const files = req.files;

    if (!files || files.length === 0) {
      throw new Error("Files not found");
    }

    const uploadPromises = files.map((file) => {
      return new Promise(async (resolve, reject) => {
        try {
          const fileBase64 = file.buffer.toString("base64");
          const fileUri = `data:${file.mimetype};base64,${fileBase64}`;

          const result = await cloudinary.uploader.upload(fileUri, {
            folder: mediaConstants.Folder,
          });

          resolve({
            publicId: result.public_id,
            url: result.secure_url,
          });
        } catch (error) {
          console.error(`Error uploading file: ${error.message}`);
          reject(error);
        }
      });
    });

    const results = await Promise.all(uploadPromises);
    return {
      message: "Upload success",
      data: results,
    };
  }

  async deleteSingle(publicId) {
    if (!publicId) {
      throw new Error("PublicId not found");
    }
    await cloudinary.uploader.destroy(publicId);

    return {
      message: `Delete success ${publicId}`,
    };
  }

  async deleteMultiple(publicIds) {
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      throw new Error("PublicIds must be a non-empty array");
    }

    const deletePromises = publicIds.map(async (publicId) => {
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        return {
          publicId,
          success: true,
          result,
        };
      } catch (error) {
        return {
          publicId,
          success: false,
          error: error.message,
        };
      }
    });

    const results = await Promise.all(deletePromises);
    return {
      message: "Delete success",
      data: results,
    };
  }
}

module.exports = new MediaService();
