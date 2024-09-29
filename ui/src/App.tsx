// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// snippet-start:[javascript.v3.scenarios.web.ListObjects]
import {useEffect, useState} from "react";
import {
    GetObjectCommand, ListBucketsCommand, ListBucketsCommandOutput,
    ListObjectsCommand,
    ListObjectsCommandOutput,
    S3Client,
} from "@aws-sdk/client-s3";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";
import "./App.css";
import FileUploader from "./FileUploader";
import VideoPlayer from "./VideoPlayer";


function App() {
    const [uploadedVideos, setUploadedVideos] = useState<
        Required<ListObjectsCommandOutput>["Contents"]
    >([]);

    const [requestedUrl, setRequestedUrl] = useState<string>("");
    const [requestedFileName, setRequestedFileName] = useState<string | undefined>("");
    const [details, setDetails] = useState<string | undefined>("");
    const sourceBucket: string = '{SOURCE_BUCKET}';
    const comprehendedBucket: string = '{COMPREHEND_BUCKET}'

    const client = new S3Client({
        region: "eu-central-1",
        credentials: fromCognitoIdentityPool({
            clientConfig: {region: "eu-central-1"},
            identityPoolId: '{IDENTITY_POOL_ID}',
        }),
    });

    //todo read from bucket
    const comprehendedJson = {
        "reading_time": 4.51,
        "text_standard": "-1th and 0th grade",
        "automated_readability_index": 34.3,
        "smog_index": 0.0,
        "flesch_kincaid_grade": 31.1,
        "flex_reading_ease": -54.75,
        "gunning_fog": 23.23,
        "dale_chall": 15.68,
        "coleman_liau": 27.05
    }

    useEffect(() => {
        const listBucket = new ListObjectsCommand({Bucket: sourceBucket});
        client.send(listBucket).then(({Contents}) => setUploadedVideos(Contents || []));
    }, []);

    const updateSummary = (filename: string) => {
        // const json = fetch(`https://${comprehendedBucket}.s3.eu-central-1.amazonaws.com/` + filename+'.json')
        const details = `
        Indeks czytelnosći: ${comprehendedJson.automated_readability_index} 
        Indeks SMOG: ${comprehendedJson.smog_index} 
        Indeks czytelności Flescha-Kinkaid: ${comprehendedJson.flesch_kincaid_grade} 
        Elastyczna łatwość czytania: ${comprehendedJson.flex_reading_ease}
        Indeks mglitosći: ${comprehendedJson.gunning_fog}
        Dale-Chall: ${comprehendedJson.dale_chall} 
        Coleman-Liau: ${comprehendedJson.coleman_liau} 
        `

        setDetails(details)
    };

    const selectVideo = (filename: string | undefined) => {
        if (!filename) {
            return
        }
        setRequestedFileName(filename);
        setRequestedUrl(`https://${sourceBucket}.s3.eu-central-1.amazonaws.com/` + filename)
        updateSummary(filename)
    };
    return (
        <div className="App">
            <header>
                <FileUploader s3Client={client} sourceBucket={sourceBucket}/>
            </header>
            <div className="main-content">
                <div className="video-list">
                    {uploadedVideos.map((video) => (
                        <div onClick={() => selectVideo(video.Key)} className="video-item">
                            <img src="https://via.placeholder.com/100x56" alt="Video Thumbnail"/>
                            <span>{video.Key}</span>
                        </div>
                    ))}
                </div>
                <div className="video-player">
                    {requestedUrl && <VideoPlayer url={requestedUrl}/>}
                    <div className="video-summary">
                        {requestedFileName ? <h2>{requestedFileName}</h2> : null}
                        {details}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default App;
