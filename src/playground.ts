import { db } from "./server/db";

await db.user.create({
  data: {
    emailAddress: "nayanph1@gmail.com",
    firstName: "nayan",
    lastName: "hanchate",
    imageUrl: "https://example.com/nayan.jpg",
  },
});

console.log("Done");
