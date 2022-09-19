import type { AWS } from "@serverless/typescript";

const AssetsBucketAndCloudfront: AWS["resources"]["Resources"] = {
  WebsiteBucket: {
    Type: "AWS::S3::Bucket",
    Properties: {
      BucketName: "${self:custom.websiteBucketName}",
      WebsiteConfiguration: {
        ErrorDocument: "index.html",
        IndexDocument: "index.html",
      },
    },
  },

  ACMCertificate: {
    Type: "AWS::CertificateManager::Certificate",
    Properties: {
      DomainName: "${self:custom.domainName.${sls:stage}}",
      DomainValidationOptions: [
        {
          DomainName: "${self:custom.domainName.${sls:stage}}",
          HostedZoneId: "${self:custom.hostedZoneId}",
        },
      ],
      ValidationMethod: "DNS",
    },
  },

  CloudFrontDistribution: {
    Type: "AWS::CloudFront::Distribution",
    Properties: {
      DistributionConfig: {
        DefaultRootObject: "index.html",
        Origins: [
          {
            DomainName: { "Fn::GetAtt": ["WebsiteBucket", "DomainName"] },
            Id: { "Fn::GetAtt": ["WebsiteBucket", "DomainName"] },
            CustomOriginConfig: {
              HTTPPort: 80,
              HTTPSPort: 443,
              OriginProtocolPolicy: "https-only",
            },
          },
        ],
        Enabled: "true",
        HttpVersion: "http2",
        DefaultCacheBehavior: {
          TargetOriginId: { "Fn::GetAtt": ["WebsiteBucket", "DomainName"] },
          ViewerProtocolPolicy: "redirect-to-https",
          AllowedMethods: ["GET", "HEAD", "OPTIONS"],
          CachedMethods: ["GET", "HEAD"],
          ForwardedValues: {
            QueryString: true,
            Headers: ["Origin"],
          },
          Compress: false,
        },
        Aliases: ["${self:custom.domainName.${sls:stage}}"],
        ViewerCertificate: {
          AcmCertificateArn: { Ref: "ACMCertificate" },
          SslSupportMethod: "sni-only",
          MinimumProtocolVersion: "TLSv1.2_2018",
        },
      },
    },
  },
};

export default AssetsBucketAndCloudfront;
