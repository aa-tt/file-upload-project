```shell
npx webpack
```
```shell
aws s3 cp dist/index.js s3://file-upload-project-bucket/lambda.zip
```
```shell
aws lambda update-function-code --function-name file-upload-backend --s3-bucket file-upload-project-bucket --s3-key lambda.zip
```
```shell