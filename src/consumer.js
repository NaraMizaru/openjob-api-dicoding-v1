import "dotenv/config";
import amqplib from "amqplib";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const QUEUE_NAME = "applications";

const processMessage = async (message) => {
  const { application_id } = JSON.parse(message.content.toString());
  console.log(`[Consumer] Processing application_id: ${application_id}`);

  const result = await pool.query(`SELECT id FROM applications WHERE id = $1`, [
    application_id,
  ]);

  if (result.rowCount === 0) {
    console.log(`[Consumer] Application not found: ${application_id}`);
    return;
  }

  console.log(
    `[Consumer] Application ${application_id} processed successfully.`,
  );
};

const start = async () => {
  const { RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASSWORD } =
    process.env;

  const url = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT || 5672}`;

  console.log("[Consumer] Connecting to RabbitMQ...");
  const connection = await amqplib.connect(url);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });
  channel.prefetch(1);

  console.log(`[Consumer] Waiting for messages in queue: ${QUEUE_NAME}`);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    try {
      await processMessage(msg);
      channel.ack(msg);
    } catch (err) {
      console.error("[Consumer] Error processing message:", err.message);
      channel.nack(msg, false, false);
    }
  });
};

start().catch((err) => {
  console.error("[Consumer] Fatal error:", err.message);
  process.exit(1);
});
