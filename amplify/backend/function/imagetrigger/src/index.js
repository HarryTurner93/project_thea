/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiApiGraphQLAPIIdOutput = process.env.API_API_GRAPHQLAPIIDOUTPUT
var apiApiGraphQLAPIEndpointOutput = process.env.API_API_GRAPHQLAPIENDPOINTOUTPUT
var apiApiImageTableName = process.env.API_API_IMAGETABLE_NAME
var apiApiImageTableArn = process.env.API_API_IMAGETABLE_ARN
var apiApiGraphQLAPIIdOutput = process.env.API_API_GRAPHQLAPIIDOUTPUT
var storageBucketBucketName = process.env.STORAGE_BUCKET_BUCKETNAME
var storageBucketBucketName = process.env.STORAGE_BUCKET_BUCKETNAME

Amplify Params - DO NOT EDIT */

// https://janhesters.com/how-to-use-aws-appsync-in-lambda-functions/
// https://aws.amazon.com/blogs/mobile/using-multiple-authorization-types-with-aws-appsync-graphql-apis/
// https://stackoverflow.com/questions/53758959/calling-appsync-mutation-from-lambda-with-cognito-user-pool-unauthorizedexcept
// https://cloudonaut.io/calling-appsync-graphql-from-lambda/

const AWS = require('aws-sdk');
const URL = require('url')

require('es6-promise').polyfill();
require('isomorphic-fetch');

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
const initiateAuth = async ({ clientId, username, password }) => cognitoIdentityServiceProvider.initiateAuth({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  })
  .promise();

const sagemaker_runtime = new AWS.SageMakerRuntime();
const s3 = new AWS.S3();


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.handler = async function(event, context) {

    console.log("Event: ", event)

    // First extract the message body.
    let body = event.Records[0].body;
    console.log("Body: ", body)

    // Parse message body.
    let json_body = JSON.parse(body)
    console.log("JSON Body: ", json_body)

    // Now extract the s3 object part of the message.
    const s3_object = json_body.Records[0].s3
    console.log("Body: ", s3_object)

    // From the S3 object, extract the key.
    const s3_key = s3_object.object.key
    console.log("S3_KEY: ", s3_key)

    let responseData = false
    const s3_params = {Bucket: 'image-bucket193339-dev', Key: s3_key};
    console.log("S3_STATUS: ", "Requesting signed url...")
    s3.getSignedUrl('getObject', s3_params, function (err, url) {
        console.log("S3_STATUS: ", "Received signed url.")
        //console.log('SIGNED_URL', url);

        let sage_params = {
            Body: Buffer.from(`{"url": "${url}"}`),
            EndpointName: 'sagemaker-pytorch-2020-06-07-07-04-39-992',
            ContentType: "application/json",
            Accept: "*/*"
        };

        console.log('SAGEMAKER_STATUS', "Invoking endpoint...");
        sagemaker_runtime.invokeEndpoint(sage_params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                responseData = JSON.parse(Buffer.from(data.Body).toString('utf8'))
                console.log('SAGEMAKER_STATUS', "Succeeded.");
            }
        });
    });

    // Setup authorisation whilst we wait for sagemaker to respond.
    const key = String(json_body.Records[0].s3.object.key).split('/')[1];
    const clientId = '7fa4bbko2ckb2cpob2bnfedmlj';
    const username = 'henry.j.turner@gmail.com';
    const password = '4loaseheb4';
    console.log('AUTH_STATUS', "Requesting authentication...");
    const { AuthenticationResult } = await initiateAuth({
        clientId,
        username,
        password,
    });
    const accessToken = AuthenticationResult && AuthenticationResult.AccessToken;
    console.log('AUTH_STATUS', "Succeeded.");

    const query = `mutation UpdateImage($input: UpdateImageInput!) {
            updateImage(input: $input) {
                id
            }
        }`


    // Now we have to wait for sagemaker to respond before we fill out the dynamo put request.
    while (!responseData) {
        console.log("SLEEP: Waiting for sagemaker...")
        await sleep(500);
    }

    const id = key;
    const url = process.env.API_API_GRAPHQLAPIENDPOINTOUTPUT;
    const uri = await URL.parse(url);

    const processed = responseData.map(item => {
        return `${item['prediction']}:${parseFloat(item['score']).toFixed(2)}`
    })
    let classes = "dummy:1.0," + processed.join(",")

    console.log("DYNAMO_CLASSES: ", classes)

    const options = {
        method: 'POST',
        body: JSON.stringify({
            query,
            variables: {
                input: {
                    id,
                    classes
                }
            }
        }),
        headers: {
          host: uri.host,
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
      };

    console.log("DYNAMO_STATUS: ", "Making put request.")

    let succeeded = false;
    while (!succeeded) {
        const response = await fetch(uri.href, options);
        const data = await response.json()

        if (data.data.updateImage != null) {
            console.log("DYNAMO_STATUS: ", "Succeeded.")
            succeeded = true
        } else {
            console.log("DYNAMO_STATUS: ", "Dynamo entry doesn't exist yet. Trying again in 2 seconds.")
        }
        await sleep(2000);
    }

};
