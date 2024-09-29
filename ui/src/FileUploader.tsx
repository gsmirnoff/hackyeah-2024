import React, {useState, ChangeEvent, useRef} from 'react';
import {
    GetObjectCommand, ListBucketsCommand, ListBucketsCommandOutput,
    ListObjectsCommand,
    ListObjectsCommandOutput, PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";


interface FileUploaderProps {
    s3Client: S3Client;
    sourceBucket: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({s3Client, sourceBucket}) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploading(true);
            try {
                await handleUpload(file);
                // Reset the file input
                event.target.value = '';
            } catch (error) {
                console.error('Upload failed:', error);
            } finally {
                setUploading(false);
            }
        }
    };



    const handleUpload = async (file: File) => {
        if (!file) {
            alert('Please select a file to upload');
            return;
        }

        setUploading(true);

        try {
            // Upload the file to S3
            const result = await s3Client.send(new PutObjectCommand({Bucket: sourceBucket, Key: file.name, Body: file}));
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
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{display: 'none'}}
            />
            <button
                className='upload-btn'
                onClick={handleButtonClick}
                disabled={uploading}
            >
                {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
        </div>
    );
};

export default FileUploader;
