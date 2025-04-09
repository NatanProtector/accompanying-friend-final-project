const Event = require("./eventModel");

exports.createEvent = async (data, userId) => {
  const event = new Event({
    ...data,
    reportedBy: userId,
    status: "pending",
  });
  await event.save();
  return event;
};
