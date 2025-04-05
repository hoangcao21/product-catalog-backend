# Getting Started

Step by step, top to bottom.

## Setup Tools
This project requires AWS SAM CLI to run the project locally. You can install it following this link: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

## Run docker
Requires that Docker Desktop is up and running.

Simply execute `docker-compose -f ./docker-compose.yml -p 'product-catalog-backend' up -d`.

## Install required dependencies
Simply execute `yarn`.


## Enable HTTPS locally
Make sure that you create and sign locally-trusted certificate using `mkcert`. Run `mkcert` on this current directory, in the end, you should see the public key `localhost.pem` and private key `localhost-key.pem` in the current directory.

## Run the seeds
Simply execute `yarn seed:up` to seed data into the database. Vice versa, run `yarn seed:down`.

Sample user to login: `sampleuser|123456@abc`

## Run the application
Each time you invoke Lambda function, AWS SAM CLI will try to create new Docker container and run the container to simulate API Gateway and Lambda behind the gateway. Note that the API Gateway is fronted by Caddy reverse proxy that server HTTPS request.

Simply execute `yarn dev`. Voila, the application should be up and running.