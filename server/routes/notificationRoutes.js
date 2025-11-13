const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

const {
  getNotifications,
  deleteNotification,
  markNotificationRead,
  getUnreadCount
} = require("../controllers/notificationController");

router.get("/", authenticateToken, getNotifications);

// NEW
router.get("/count", authenticateToken, getUnreadCount);

// NEW
router.put("/read/:id", authenticateToken, markNotificationRead);

router.delete("/:id", authenticateToken, deleteNotification);

module.exports = router;
