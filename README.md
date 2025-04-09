
# Folder Structure
Current folder structure of this repository.
```
└── 📁src
    └── 📁functions
        └── auth.ts
        └── preflight.ts
        └── products.ts
    └── 📁modules
        └── 📁auth
            └── auth.api.module.ts
            └── auth.controller.ts
            └── auth.module.ts
            └── auth.service.ts
            └── cookie.service.ts
            └── 📁dtos
                └── 📁request
                    └── login.dto.ts
                └── 📁response
        └── 📁product
        └── 📁product-review
            └── 📁dtos
                └── 📁request
                    └── create-product-review.body.dto.ts
                    └── create-product-review.request.dto.ts
                └── 📁response
                    └── product-review.dto.ts
            └── 📁entities
                └── product-review.entity.ts
                └── product-review.repository.ts
            └── product-review.module.ts
            └── product-review.service.ts
            └── 📁dtos
                └── 📁request
                    └── get-product.query.dto.ts
                    └── product-id.path-parms.dto.ts
                └── 📁response
                    └── product.dto.ts
            └── 📁entities
                └── product.entity.ts
                └── product.repository.ts
            └── 📁errors
                └── .gitkeep
            └── product.api.module.ts
            └── product.controller.ts
            └── product.module.ts
            └── product.service.ts
            └── 📁types
                └── .gitkeep
        └── 📁user
            └── 📁entities
                └── user.entity.ts
                └── user.repository.ts
            └── user.module.ts
            └── user.service.ts
    └── 📁seeds
        └── index.ts
        └── 📁products
            └── index.ts
        └── 📁users
            └── index.ts
    └── 📁shared
        └── 📁builders
            └── base.builder.ts
            └── product-entity.builder.ts
            └── user-entity.builder.ts
        └── 📁config
            └── index.ts
        └── 📁crypto
            └── index.ts
        └── cursor.ts
        └── 📁database
            └── database-connection.ts
            └── dynamoose-model-type.ts
            └── pagination-query-response.ts
            └── repository.ts
        └── 📁dto
            └── 📁request
                └── index.ts
            └── 📁response
                └── index.ts
        └── 📁errors
            └── http.ts
        └── 📁middlewares
            └── auth.middleware.ts
            └── common.middleware.ts
            └── handle-error.middleware.ts
            └── parse-and-validate.middleware.ts
        └── validation.ts
```
# Run this project locally

To run this project locally, you will need to follow steps below (from top to bottom).
## Setup Tools
This project requires AWS SAM CLI to run the project locally. You can install it following this link: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html.

AWS SAM CLI will help you set up API Gateway and Lambda integrations in Docker locally and automatically based on `template.yml`, you don't need to set up Docker configuration yourself. In the end, you should experience similar production behavior of API Gateway and Lambda in your local environment.

## Run docker
Requires that Docker Desktop is up and running.

Simply execute `docker-compose -f ./docker-compose.yml -p 'product-catalog-backend' up -d` to run container for local DynamoDB database.

## Install required dependencies
Simply execute `yarn` to install dependencies.

## Enable HTTPS locally
Make sure that you create and sign locally-trusted certificate using `mkcert`. Run `mkcert` on this current directory, in the end, you should see the public key `localhost.pem` and private key `localhost-key.pem` in the current directory.

Reference: https://github.com/FiloSottile/mkcert.

## Run the seeds
Simply execute `yarn seed:up` to seed data into the database. Vice versa, run `yarn seed:down` if you want to remove all data from database.

Sample user to login: `sampleuser|123456@abc` after successful data seeding into database.

## Run the application
Each time you call an API endpoint, AWS SAM CLI will try to create new Docker container and run the container to simulate behavior of API Gateway and Lambda locally. Note that the API Gateway is fronted by Caddy reverse proxy that server HTTPS request.

Simply execute `yarn dev`. Voila! the application should be up and running at port `8443`.

# Deploy this project to AWS
To deploy the application to AWS, you need to follow these steps.
- First, you need to build and bundle your Lambda functions by executing the command `yarn build:functions`. The bundled version of your Lambda functions should be output to `dist/functions` folder
- Then, you need to execute the command `yarn package:all` to zip your Lambda functions one by one
- Your Lambda functions are ready to deploy to AWS. Now, navigate to `product-catalog-iac`, then run this command `cdk deploy ProductCatalogBackendStack` to deploy your backend applications to AWS
- After successful deployment of backend stack, console should output the public URL of PROD stage of API Gateway in following format
```
// product-catalog-iac
Outputs:
ProductCatalogBackendStack.CfnRestApiGatewayUrl = <generated value> // This is the REST API entry endpoint
ProductCatalogBackendStack.RestApiGatewayEndpointF48811B0 = <generated value>
```