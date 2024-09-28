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
  const [objects, setObjects] = useState<
    Required<ListObjectsCommandOutput>["Contents"]
  >([]);


  const [buckets, setBuckets] = useState<
      Required<ListBucketsCommandOutput>["Buckets"]
  >([]);

  useEffect(() => {
    const client = new S3Client({
      region: "eu-central-1",
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: "eu-central-1" },
        identityPoolId: '{IDENTITY_POOL_ID}',
      }),
    });


    const listBuckects = new ListBucketsCommand();

    const command = new ListObjectsCommand({ Bucket: "{SOURCE_BUCKET}" });

    client.send(command).then(({ Contents }) => setObjects(Contents || []));
  }, []);

  return (
    <div className="App">
      <FileUploader/>
      <VideoPlayer url={""}/>
      {buckets.map((bucket) => (
          <div>{bucket.Name}</div>
      ))}
      {objects.map((o) => (
          <div key={o.ETag}>{o.Key}</div>
      ))}
    </div>
  );
}

export default App;
// snippet-end:[javascript.v3.scenarios.web.ListObjects]
