import type { ProxyHandler } from "aws-lambda";
import fetch from "node-fetch";

export const proxyHandler: ProxyHandler = async (event, context) => {
  const { httpMethod, path } = event;

  if (httpMethod === "GET" && ["/quotes"].includes(path)) {
    try {
      const quotes = await fetch(`https://type.fit/api/quotes`).then((res) =>
        res.json()
      );

      const randomNumber = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomNumber];

      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: quote,
      };
    } catch (err) {
      return {
        statusCode: 500,
      };
    }
  }

  return {
    statusCode: 403,
    body: "Execute access forbidden",
  };
};
