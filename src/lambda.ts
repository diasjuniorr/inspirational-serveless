import AWS from "aws-sdk";
import type { ProxyHandler, S3Handler } from "aws-lambda";
import fetch from "node-fetch";
import sharp from "sharp";
import { basename, extname } from "path";

interface Quote {
  text: string;
  author: string;
}

const S3 = new AWS.S3();
const bucketName = process.env.PictureS3Bucket as string;

export const pictureOptmizer: S3Handler = async (
  { Records: records },
  context
) => {
  try {
    await Promise.all(
      records.map(async (record) => {
        const { key } = record.s3.object;

        const image = await S3.getObject({
          Bucket: bucketName,
          Key: key,
        }).promise();

        const optimized = await sharp(image.Body as Buffer)
          .resize(1280, 720, { fit: "inside", withoutEnlargement: true })
          .toFormat("jpeg", { progressive: true, quality: 50 })
          .toBuffer();

        await S3.putObject({
          Body: optimized,
          Bucket: bucketName,
          ContentType: "image/jpeg",
          Key: `compressed/${basename(key, extname(key))}.jpg`,
        }).promise();
      })
    );

    return {
      statusCode: 201,
      Body: {},
    };
  } catch (err) {
    return err;
  }
};

export const proxyHandler: ProxyHandler = async (event, context) => {
  const { httpMethod, path } = event;

  if (httpMethod === "GET" && ["/quotes"].includes(path)) {
    try {
      const quotes: Quote[] = await fetch(
        `https://type.fit/api/quotes`
      ).then((res) => res.json());

      const randomNumber = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomNumber];

      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(quote),
      };
    } catch (err) {
      return err;
    }
  }

  if (httpMethod === "PUT" && ["/avatar"])
    return {
      statusCode: 403,
      body: "Execute access forbidden",
    };
};
export const proxyHandler2: ProxyHandler = async (event, context) => {
  const { httpMethod, path } = event;

  if (httpMethod === "GET" && ["/quotes"].includes(path)) {
    let amount = 1;
    if (event.queryStringParameters && event.queryStringParameters.amount) {
      amount = +event.queryStringParameters.amount;
    }

    try {
      const quotes: Quote[] = await fetch(
        `https://type.fit/api/quotes`
      ).then((res) => res.json());

      const numberOfQuotes = amount > quotes.length ? quotes.length : amount;
      const truncatedQuotes = [];
      for (let i = 0; i < numberOfQuotes; i++) {
        truncatedQuotes.push(quotes[i]);
      }

      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(truncatedQuotes),
      };
    } catch (err) {
      return err;
    }
  }
};
