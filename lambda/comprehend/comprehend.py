import os
import boto3
import os
import json
import textstat



def lambda_handler(event, context):
    s3_client = boto3.client('s3')

    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    output_bucket_name = os.environ['OUTPUT_BUCKET_NAME']
    output_file_name = key + '-comprehended.json'

    # Get the document from S3
    s3_response = s3_client.get_object(Bucket=bucket, Key=key)
    document_content = s3_response['Body'].read().decode('utf-8')

    # Parse the JSON document
    document = json.loads(document_content)

    # Extract the transcribed text
    transcribed_text = document['results']['transcripts'][0]['transcript']

    # Use textstat to evaluate transcribed text
    try:
        print(f"Textstat magic started: {key}")

        textstat.set_lang('pl')

        result = {
            "reading_time": textstat.reading_time(transcribed_text),
            "text_standard": textstat.text_standard(transcribed_text),
            "automated_readability_index": textstat.automated_readability_index(transcribed_text),
            "smog_index": textstat.smog_index(transcribed_text),
            "flesch_kincaid_grade": textstat.flesch_kincaid_grade(transcribed_text),
            "flex_reading_ease": textstat.flesch_reading_ease(transcribed_text),
            "gunning_fog": textstat.gunning_fog(transcribed_text),
            "dale_chall": textstat.dale_chall_readability_score_v2(transcribed_text),
            "coleman_liau": textstat.coleman_liau_index(transcribed_text)
        }

        print(f"Textstat magic finished: {key}")
    except Exception as e:
        print(f"Error starting textstat magic: {str(e)}")
        return {
            'statusCode': 500,
            'body': f"Error starting textstat magic: {str(e)}"
        }

    # Write the entities detected in the transcribed text to a JSON file
    with open('/tmp/' + output_file_name, 'w') as outfile:
        json.dump(result, outfile)

    # Upload the JSON file to S3
    try:
        s3_client.upload_file('/tmp/' + output_file_name, output_bucket_name, output_file_name)
    except Exception as e:
        print(f"Error writing to bucket textstat response: {str(e)}")
        return {
            'statusCode': 500,
            'body': f"Error writing to bucket textstat response: {str(e)}"
        }

    return {
        'statusCode': 200
    }
