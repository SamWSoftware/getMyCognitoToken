import type { AWS } from "@serverless/typescript";

import AssetsBucketAndCloudfront from "./serverless/AssetsBucketAndCloudfront";

const serverlessConfiguration: AWS = {
  service: "getMyCognitoToken",
  frameworkVersion: "3",

  plugins: ["serverless-s3-sync"],
  custom: {
    websiteBucketName: "${sls:stage}-getmycognitotoken-website-bucket-2",

    hostedZoneId: "Z01185332XVWJH8JM7BYY",
    domainName: {
      dev: "getmycognitotoken.com",
    },

    s3Sync: [
      {
        bucketName: "${self:custom.websiteBucketName}",
        localDir: "./build",
        deleteRemoved: true,
        acl: "public-read",
        followSymlinks: true,
        defaultContentType: "text/html",
        params: [
          {
            "index.html": {
              CacheControl: "no-cache",
            },
          },
          {
            "*.js": {
              CacheControl: "public, max-age=31536000",
            },
          },
        ],
      },
    ],

    profile: {
      dev: "serverlessCommunityAct",
      prod: "serverlessCommunityAct",
    },

    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    profile: "${self:custom.profile.${sls:stage}}",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
  },

  resources: {
    Resources: {
      ...AssetsBucketAndCloudfront,
    },
  },
};

module.exports = serverlessConfiguration;
