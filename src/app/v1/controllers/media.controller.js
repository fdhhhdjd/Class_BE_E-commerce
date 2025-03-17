const mediaService = require("../services/media.service");

class MediaController {
  async getMedia(req, res) {
    try {
      const result = await mediaService.getMedia(req.query.publicId);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async uploadSingle(req, res) {
    try {
      const result = await mediaService.uploadSingle(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async uploadMultiple(req, res) {
    try {
      const result = await mediaService.uploadMultiple(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async deleteSingle(req, res) {
    try {
      const result = await mediaService.deleteSingle(req.query.publicId);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  async deleteMultiple(req, res) {
    try {
      const result = await mediaService.deleteMultiple(req.body.publicIds);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new MediaController();
