import amqp from "amqplib/callback_api";
import ejs from "ejs";
import fs from "fs";

const exchange = "new_form_widget_exchange";
const queue = "queue";
const routingKey = "form_widget";
export const publishMessage = async (channel: amqp.Channel, message: any) => {
  try {
    channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const connectRabbitMQ = () => {
  try {
    return new Promise<amqp.Channel>((resolve, reject) => {
      amqp.connect("amqp://localhost", function (error0, connection) {
        if (error0) {
          throw error0;
        }

        connection.createChannel(function (error1, channel) {
          if (error1) {
            throw error1;
          }

          resolve(channel);
        });
      });
    });
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    throw error;
  }
};

export const backgroundWorker = async () => {
  try {
    const channel = await connectRabbitMQ();
   

    channel.assertExchange(exchange, "direct", { durable: true });
    channel.assertQueue(queue, { durable: true });
    channel.bindQueue(queue, exchange, routingKey);
    channel.consume(
      queue,
      async function (message) {
        try {
          const formWidgetData = JSON.parse(message!.content.toString());

          if (
            !fs.existsSync(
              "C:\\Users\\berna\\OneDrive\\Área de Trabalho\\viral-loops-api\\src\\FormWidgetComponent.ejs"
            )
          ) {
            throw new Error(`File does not exist: "./FormWidgetComponent.ejs"`);
          }

          const html = await ejs.renderFile(
            "C:\\Users\\berna\\OneDrive\\Área de Trabalho\\viral-loops-api\\src\\FormWidgetComponent.ejs",
            {
              fields: formWidgetData,
              raw: true,
            }
          );

          await fs.promises.writeFile(
            `C:\\Users\\berna\\OneDrive\\Área de Trabalho\\viral-loops-api\\src\\widgets\\${formWidgetData.id}.html`,
            html, "utf-8"
          );

          console.log(
            `Received message for Form Widget ID: ${formWidgetData.id}`
          );
        } catch (err) {
          console.error("Error processing the message:", err);

          channel.nack(message!);
        } finally {
          if (channel) {
            try {
              channel.close(() => {
                console.log("Channel closed successfully");
              });
             
            } catch (err) {
              console.error("Error closing channel:", err);
            }
          }
        }
      },
      {
        noAck: true
      }
    );
  } catch (err) {
    console.error("Error in backgroundWorker:", err);
  }
};

export const deleteQueue = async (queueName: string) => {
    try {
     const channel=  await connectRabbitMQ()
  
      channel.deleteQueue(queueName, {}, (error, ok) => {
        if (error) {
          console.error("Error deleting the queue:", error);
        } else {
          console.log(`Queue '${queueName}' deleted successfully.`);
        }
  
        channel.close(() => {});
      });
    } catch (error) {
      console.error("Error deleting the queue:", error);
    }
  };