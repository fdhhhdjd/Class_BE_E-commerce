const cron = require("node-cron");
const pgDatabase = require("../app/share/database/pg.database");

async function markExpiredOtpCodesAsUsed() {
  try {
    const query = `
        SELECT id, expires_at
        FROM otp_codes
        WHERE is_used = false
      `;
    const { rows } = await pgDatabase.query(query);

    const currentTime = new Date();

    // Lọc các OTP đã hết hạn
    const expiredOtpIds = rows
      .filter((row) => new Date(row.expires_at) < currentTime)
      .map((row) => row.id);

    if (expiredOtpIds.length > 0) {
      const updateQuery = `
          UPDATE otp_codes
          SET is_used = true
          WHERE id = ANY($1)
        `;
      await pgDatabase.query(updateQuery, [expiredOtpIds]);
    }

    console.log(`✅ Updated ${expiredOtpIds.length} expired OTP codes.`);
    return expiredOtpIds.length;
  } catch (error) {
    console.error("❌ Error checking/updating expired OTP codes:", error);
    return 0;
  }
}

async function runCronJob() {
  try {
    const count = await markExpiredOtpCodesAsUsed();
    console.log(`Cron job completed. ${count} OTP codes were updated.`);
  } catch (error) {
    console.error("Cron job failed:", error);
  }
}

// Run 00:00 every day
cron.schedule("0 0 * * *", async () => {
  console.log(
    "Running cron job every 1 minute to mark expired OTP codes as used..."
  );
  await runCronJob();
});

cron.schedule("0 0 * * *", async () => {
  console.log(
    "Running cron job every 1 minute to mark expired OTP codes as used..."
  );
  await runCronJob();
});
