const { PrismaClient } = require('@prisma/client');
try {
  const p = new PrismaClient({});
  console.log("Success with empty object");
} catch (e) {
  console.error("Error with empty object:", e);
}
try {
  const p2 = new PrismaClient();
  console.log("Success with no args");
} catch (e) {
  console.error("Error with no args:", e.message);
}
