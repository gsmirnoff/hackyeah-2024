import boto3
import os
import uuid


def lambda_handler(event, context):
    # Initialize S3 and Transcribe clients
    s3_client = boto3.client('s3')
    transcribe_client = boto3.client('transcribe')

    # Get the S3 bucket and key from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    # Generate a unique job name
    job_name = f"transcription-job-{uuid.uuid4()}"

    # Get the S3 object URL
    s3_url = f"s3://{bucket}/{key}"

    # Start the transcription job
    try:
        response = transcribe_client.start_transcription_job(
            TranscriptionJobName=job_name,
            LanguageCode='pl-PL',  # Specify the language of the audio
            MediaFormat='mp4',  # Specify the media format (change if different)
            Media={
                'MediaFileUri': s3_url
            },
            OutputBucketName=os.environ['OUTPUT_BUCKET_NAME'],
            OutputKey=f"{key}.json"
        )

        print(f"Transcription job started: {job_name}")
        return {
            'statusCode': 200,
            'body': f"Transcription job started: {job_name}"
        }
    except Exception as e:
        print(f"Error starting transcription job: {str(e)}")
        return {
            'statusCode': 500,
            'body': f"Error starting transcription job: {str(e)}"
        }
