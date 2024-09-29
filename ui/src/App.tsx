// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// snippet-start:[javascript.v3.scenarios.web.ListObjects]
import { useEffect, useState } from "react";
import {
  GetObjectCommand, ListBucketsCommand, ListBucketsCommandOutput,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import "./App.css";
import FileUploader from "./FileUploader";
import VideoPlayer from "./VideoPlayer";



function App() {
  const [uploadedVideos, setUploadedVideos] = useState<
    Required<ListObjectsCommandOutput>["Contents"]
  >([]);

  const [requestedUrl, setRequestedUrl] = useState<string>("");
  const [requestedFileName, setRequestedFileName] = useState<string | undefined>("");
  let sourceBucket: string = '{SOURCE_BUCKET}';

  const client = new S3Client({
    region: "eu-central-1",
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: "eu-central-1" },
      identityPoolId: '{IDENTITY_POOL_ID}',
    }),
  });

  useEffect(() => {
    const listBucket = new ListObjectsCommand({Bucket: sourceBucket});
    client.send(listBucket).then(({Contents}) => setUploadedVideos(Contents || []));
  }, []);

  const selectVideo = (filename: string | undefined) => {
    setRequestedFileName(filename);
    setRequestedUrl(`https://${sourceBucket}.s3.eu-central-1.amazonaws.com/`+filename)
  };
  return (
      <div className="App">
        <header>
          <FileUploader s3Client={client} sourceBucket={sourceBucket} />
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
            {requestedUrl ? <VideoPlayer url={requestedUrl}/> : null}
            <div className="video-summary">
              {requestedFileName ? <h2>{requestedFileName}</h2> : null}
              <p>This is a summary of the selected video. It provides a brief description of the video content and any
                additional information that might be relevant to the viewer.</p>
            </div>
          </div>
        </div>

      </div>
);
}

export default App;
