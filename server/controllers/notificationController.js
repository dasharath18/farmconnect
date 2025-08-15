const Notification = require("../models/Notification");

// Get notifications for current user
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

// Delete a notification (optional: TTL will remove them anyway)
const deleteNotification = async (req, res) => {
  try {
    const notif = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
    if (!notif) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteNotification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getNotifications, deleteNotification };
