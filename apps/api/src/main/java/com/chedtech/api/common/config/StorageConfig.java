package com.chedtech.api.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

@Configuration
public class StorageConfig {

    @Value("${ch-edtech.storage.endpoint:http://localhost:9000}")
    private String endpoint;

    @Value("${ch-edtech.storage.region:us-east-1}")
    private String region;

    @Value("${ch-edtech.storage.access-key:minio_dev_admin}")
    private String accessKey;

    @Value("${ch-edtech.storage.secret-key:minio_dev_secret_password_2026}")
    private String secretKey;

    @Value("${ch-edtech.storage.use-path-style:true}")
    private boolean usePathStyle;

    @Value("${ch-edtech.storage.bucket-documents:ch-edtech-documents}")
    private String bucketDocuments;

    @Value("${ch-edtech.storage.bucket-public:ch-edtech-public}")
    private String bucketPublic;

    @Bean
    public S3Client s3Client() {
        S3Configuration serviceConfiguration = S3Configuration.builder()
                .pathStyleAccessEnabled(usePathStyle)
                .build();

        S3Client client = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .serviceConfiguration(serviceConfiguration)
                .build();

        // Ensure default buckets exist
        ensureBucketExists(client, bucketDocuments);
        ensureBucketExists(client, bucketPublic);

        return client;
    }

    @Bean
    public S3Presigner s3Presigner() {
        S3Configuration serviceConfiguration = S3Configuration.builder()
                .pathStyleAccessEnabled(usePathStyle)
                .build();

        return S3Presigner.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .serviceConfiguration(serviceConfiguration)
                .build();
    }

    private void ensureBucketExists(S3Client client, String bucketName) {
        try {
            client.headBucket(HeadBucketRequest.builder().bucket(bucketName).build());
        } catch (Exception e) {
            try {
                client.createBucket(CreateBucketRequest.builder().bucket(bucketName).build());
            } catch (Exception createEx) {
                // Ignore if created concurrently or already exists
            }
        }
    }
}

