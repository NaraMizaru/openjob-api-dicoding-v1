import amqplib from 'amqplib';

let connection = null;
let channel = null;

export const getChannel = async () => {
    if (channel) return channel;

    const {
        RABBITMQ_HOST,
        RABBITMQ_PORT,
        RABBITMQ_USER,
        RABBITMQ_PASSWORD,
    } = process.env;

    const url = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT || 5672}`;

    connection = await amqplib.connect(url);
    channel = await connection.createChannel();

    console.log('RabbitMQ connected');
    return channel;
};

export const QUEUE_NAME = 'applications';
