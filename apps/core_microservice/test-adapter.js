const { PrismaPg } = require('@prisma/adapter-pg');
try {
  const adapter = new PrismaPg({ connectionString: 'postgres://user:pass@localhost/db' });
  console.log("PrismaPg accepts connectionString");
} catch (e) {
  console.error("PrismaPg error:", e.message);
}
