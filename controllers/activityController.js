import mongoose from "mongoose";
import Activity from "../models/activityModel.js";

/**
 * Create activity log
 * (Use this whenever a user performs an action)
 */
const createActivity = async (req, res) => {
  try {
    const {
      user,
      email,
      action,
      module,
      details,
      ip,
      metadata,
      performedBy,
      isSystem,
    } = req.body;

    if (!user || !action || !module) {
      return res.status(400).json({
        message: "User, action, and module are required",
      });
    }

    const activity = await Activity.create({
      user,
      email,
      action,
      module,
      details,
      ip,
      metadata,
      performedBy,
      isSystem,
    });

    res.status(201).json({
      message: "Activity logged successfully",
      data: activity,
    });
  } catch (error) {
    console.error("Create Activity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all activity logs (with search & filters)
 */
const getAllActivities = async (req, res) => {
  try {
    const { search, module, action, startDate, endDate } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { user: { $regex: search, $options: "i" } },
        { action: { $regex: search, $options: "i" } },
        { module: { $regex: search, $options: "i" } },
      ];
    }

    if (module && module !== "All") {
      query.module = module;
    }

    if (action) {
      query.action = action;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(500);

    res.status(200).json({
      total: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error("Get Activities Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get single activity by ID
 */
const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid activity ID" });
    }

    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error("Get Activity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get activity summary (for dashboard cards)
 */
const getActivitySummary = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalActivities,
      todayActivities,
      activeUsers,
      modulesAccessed,
    ] = await Promise.all([
      Activity.countDocuments(),
      Activity.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      }),
      Activity.distinct("user"),
      Activity.distinct("module"),
    ]);

    res.status(200).json({
      totalActivities,
      todayActivities,
      activeUsers: activeUsers.length,
      modulesAccessed: modulesAccessed.length,
    });
  } catch (error) {
    console.error("Activity Summary Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete activity (optional / admin only)
 */
const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid activity ID" });
    }

    const activity = await Activity.findByIdAndDelete(id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Delete Activity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= EXPORTS ================= */

export {
  createActivity,
  getAllActivities,
  getActivityById,
  getActivitySummary,
  deleteActivity,
};
