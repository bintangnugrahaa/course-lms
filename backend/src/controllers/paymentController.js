import transactionModel from "../models/transactionModel.js";

const serverError = (res) =>
  res.status(500).json({ message: "Internal server error" });

export const handlePayment = async (req, res) => {
  try {
    const { order_id, transaction_status } = req.body;

    if (!order_id || !transaction_status) {
      return res.status(400).json({
        message: "Invalid payment payload",
      });
    }

    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      await transactionModel.findByIdAndUpdate(order_id, {
        status: "success",
      });
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire" ||
      transaction_status === "failure"
    ) {
      await transactionModel.findByIdAndUpdate(order_id, {
        status: "failed",
      });
    }

    return res.json({
      message: "Handle Payment Success",
      data: {},
    });
  } catch {
    return serverError(res);
  }
};
