// 1. Find all the topics and tasks which are taught in the month of October
db.topics.find({
  scheduledDate: {
    $gte: ISODate("2023-10-01"),
    $lt: ISODate("2023-11-01"),
  },
});

db.tasks.find({
  scheduledDate: {
    $gte: ISODate("2023-10-01"),
    $lt: ISODate("2023-11-01"),
  },
});

// 2. Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020
db.company_drives.find({
  driveDate: {
    $gte: ISODate("2020-10-15"),
    $lte: ISODate("2020-10-31"),
  },
});

// 3. Find all the company drives and students who are appeared for the placement
db.company_drives.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "students",
      foreignField: "_id",
      as: "appeared_students",
    },
  },
]);

// 4. Find the number of problems solved by the user in codekata
db.users.aggregate([
  {
    $lookup: {
      from: "codekata",
      localField: "_id",
      foreignField: "userId",
      as: "solved_problems",
    },
  },
  {
    $project: {
      name: 1,
      problems_solved: { $size: "$solved_problems" },
    },
  },
]);

// 5. Find all the mentors with who has the mentee's count more than 15
db.mentors.find({
  mentees: { $size: { $gt: 15 } },
});

// 6. Find the number of users who are absent and task is not submitted between 15 oct-2020 and 31-oct-2020
db.attendance.aggregate([
  {
    $match: {
      date: {
        $gte: ISODate("2020-10-15"),
        $lte: ISODate("2020-10-31"),
      },
      isPresent: false,
    },
  },
  {
    $lookup: {
      from: "tasks",
      localField: "userId",
      foreignField: "userId",
      as: "user_tasks",
    },
  },
  {
    $match: {
      user_tasks: { $size: 0 },
    },
  },
  {
    $group: {
      _id: null,
      count: { $sum: 1 },
    },
  },
]);
