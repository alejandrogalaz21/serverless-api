# Seed Data for DynamoDB

```BASH
aws dynamodb batch-write-item --request-items file://users-dev.json --endpoint-url http://localhost:8000
```	

## Seed Data for AWS DynamoDB Prod

```BASH
 aws dynamodb batch-write-item \
  --request-items file://users.json \
  --region us-west-2
```