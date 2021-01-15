# Inspirational API - AWS Serverless REST API

This project was created to demonstrate how to create a REST API using AWS SAM and deploying using [**carlin**](https://carlin.ttoss.dev).

## API v1

- **URL**: https://fx3yxxc4xj.execute-api.us-east-1.amazonaws.com/v1

This example has one endpoint

- **GET /quotes**: Returns a random inspirational quote

## API v2

- **URL**: https://s0ryhhawo6.execute-api.us-east-1.amazonaws.com/v2

This example has one endpoint that accepts a query parameter to specify the number of quotes
returned

- **GET /quotes?amount=1**: Returns an array of inspirational quotes

Thanks to [Pedro Arantes](https://twitter.com/arantespp) for dedicating some time during the past two days to instruct me and also for providing the awesome npm package [**carlin**](https://carlin.ttoss.dev). which makes the process of deploying a lot easier and faster.
