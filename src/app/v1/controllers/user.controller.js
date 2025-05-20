const userService = require("../services/user.service");

class UserController {
  /**
   * @swagger
   * /api/user/profile:
   *   get:
   *     summary: Lấy thông tin profile người dùng
   *     tags:
   *       - Users
   *     responses:
   *       200:
   *         description: Thành công
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "User found successfully"
   *                 user:
   *                   type: object
   *                   properties:
   *                     user_id:
   *                       type: string
   *                       example: "12345"
   *                     email:
   *                       type: string
   *                       example: "user@example.com"
   *                     full_name:
   *                       type: string
   *                       example: "John Doe"
   *                     role:
   *                       type: object
   *                       properties:
   *                         role_id:
   *                           type: string
   *                           example: "1"
   *                         role_name:
   *                           type: string
   *                           example: "Admin"
   *       500:
   *         description: Lỗi server
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Internal Server Error"
   */
  async getUser(req, res) {
    try {
      const result = await userService.getUser(req);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  /**
   * @swagger
   * /api/user/profile:
   *   post:
   *     summary: Cập nhật thông tin người dùng
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               full_name:
   *                 type: string
   *                 example: "John Doe"
   *               email:
   *                 type: string
   *                 example: "user@example.com"
   *     responses:
   *       200:
   *         description: Thành công
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "User updated successfully"
   *       500:
   *         description: Lỗi server
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Internal Server Error"
   */
  async updateUser(req, res) {
    try {
      await userService.updateUser(req);
      return res.status(200).send({
        message: "User updated successfully",
      });
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }

  /**
   * @swagger
   * /api/user/update-password:
   *   post:
   *     summary: Cập nhật mật khẩu người dùng
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               oldPassword:
   *                 type: string
   *                 example: "oldpassword123"
   *               newPassword:
   *                 type: string
   *                 example: "newpassword123"
   *     responses:
   *       200:
   *         description: Thành công
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Password updated successfully"
   */
  async updatePassword(req, res) {
    try {
      await userService.updatePassword(req);
      return res.status(200).send({
        message: "Password updated successfully",
      });
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new UserController();
