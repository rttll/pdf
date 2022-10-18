# pdf

https://cloud.google.com/functions/docs/create-deploy-http-ruby#creating_a_function
https://googlecloudplatform.github.io/functions-framework-ruby/v1.2.0/file.writing-functions.html#the-runtime-environment

## dev

`gcloud functions logs read pdf`

```
bundle exec functions-framework-ruby --target pdf --port 3333
```

## deploy

```
gcloud config list
# => project == the-wedding-expo?
# => yes? good

gcloud functions deploy pdf --runtime ruby30 --trigger-http --allow-unauthenticated

```
