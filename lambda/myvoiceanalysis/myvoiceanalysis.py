import boto3
import os


def lambda_handler(event, context):
    s3_client = boto3.client('s3')
    mysp = __import__("my-voice-analysis")

    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    temp_dir = '/tmp'
    temp_file = 'audio_file.wav'
    output_bucket_name = os.environ['OUTPUT_BUCKET_NAME']
    output_file_name = key + '-voiceanalysis.json'

    # Get the audio from S3
    try:
        s3_client.download_file(bucket, key, temp_dir + '/' + temp_file)
    except Exception as e:
        print(f"Error downloading audio file: {str(e)}")
        return {
            'statusCode': 500,
            'body': f"Error downloading audio file: {str(e)}"
        }

    # Use myvoiceanalysis to evaluate speech
    try:
        print(f"My voice analysis magic started")

        result = {
            "gender and mood": mysp.myspgend(temp_file,temp_dir),
            "pronunciation pasteriority": mysp.mysppron(temp_file,temp_dir),
            "fillers and pauses": mysp.mysppaus(temp_file,temp_dir),
            "rate of speech": mysp.myspsr(temp_file,temp_dir),
            "articulation": mysp.myspatc(temp_file,temp_dir),
            "freq distribution min": mysp.myspf0min(temp_file,temp_dir),
            "freq distribution max": mysp.myspf0max(temp_file,temp_dir)
        }

        print(f"My voice analysis magic finished")
    except Exception as e:
        print(f"Error starting textstat magic: {str(e)}")
        return {
            'statusCode': 500,
            'body': f"Error starting textstat magic: {str(e)}"
        }

    # Upload the JSON file to S3
    try:
        s3_client.upload_file(temp_dir + '/' + output_file_name, output_bucket_name, output_file_name)
    except Exception as e:
        print(f"Error writing to bucket myvoiceanalysis response: {str(e)}")
        return {
            'statusCode': 500,
            'body': f"Error writing to bucket myvoiceanalysis response: {str(e)}"
        }

    return {
        'statusCode': 200
    }
