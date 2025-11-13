const Notification = require("../models/Notification");

// ---------------- GET ALL NOTIFICATIONS ----------------
const getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("fromUser", "name phone email");

    res.json(notifs);
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- DELETE NOTIFICATION ----------------
const deleteNotification = async (req, res) => {
  try {
    const notif = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notif) return res.status(404).json({ message: "Notification not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteNotification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- MARK AS READ (NEW) ----------------
const markNotificationRead = async (req, res) => {
  try {
    const notif = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notif) return res.status(404).json({ message: "Notification not found" });

    notif.read = true;
    await notif.save();

    res.json({ message: "Marked as read" });
  } catch (err) {
    console.error("markNotificationRead error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- UNREAD COUNT (NEW) ----------------
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.json({ unread: count });
  } catch (err) {
    console.error("getUnreadCount error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getNotifications,
  deleteNotification,
  markNotificationRead,
  getUnreadCount,
};
