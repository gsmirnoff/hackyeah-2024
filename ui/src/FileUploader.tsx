import React, { useState, ChangeEvent } from 'react';
import {
    GetObjectCommand, ListBucketsCommand, ListBucketsCommandOutput,
    ListObjectsCommand,
    ListObjectsCommandOutput, PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";

const FileUploader: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const listBuckets = new ListBucketsCommand();
    const client = new S3Client({
        region: "eu-central-1",
        credentials: fromCognitoIdentityPool({
            clientConfig: { region: "eu-central-1" },
            identityPoolId: '{IDENTITY_POOL_ID}',
        }),
    });
    const sourceBucket = `{SOURCE_BUCKET}`;


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file to upload');
            return;
        }

        setUploading(true);

        try {
            // Upload the file to S3
            const result = await client.send(new PutObjectCommand({Bucket: sourceBucket, Key: file.name, Body: file}));
            console.log('File uploaded successfully', result);
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
};

export default FileUploader;
