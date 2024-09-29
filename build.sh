#!/bin/bash
set -x
mkdir -p build
mkdir -p build/transcribe
mkdir -p build/comprehend
mkdir -p build/myvoiceanalysis

# prepare transcribe lambda package
cp lambda/transcribe/transcribe.py build/transcribe/transcribe.py
python3 -m pip install boto3 -t build/transcribe
python3 -m pip install uuid -t build/transcribe
python3 -m pip install os -t build/transcribe
cd build/transcribe && zip -r ../transcribe.zip . && cd ../../ && rm -rf build/transcribe

# prepare comprehend lambda package
cp lambda/comprehend/comprehend.py build/comprehend/comprehend.py
python3 -m pip install boto3 -t build/comprehend
python3 -m pip install json -t build/comprehend
python3 -m pip install os -t build/comprehend
python3 -m pip install textstat -t build/comprehend
cd build/comprehend && zip -r ../comprehend.zip . && cd ../../ && rm -rf build/comprehend

# prepare myvoiceanalysis lambda package
cp lambda/myvoiceanalysis/myvoiceanalysis.py build/myvoiceanalysis/myvoiceanalysis.py
python3 -m pip install boto3 -t build/myvoiceanalysis
python3 -m pip install os -t build/myvoiceanalysis
python3 -m pip install praat-parselmouth -t build/myvoiceanalysis
python3 -m pip install my-voice-analysis -t build/myvoiceanalysis
#cd build/myvoiceanalysis && zip -r ../myvoiceanalysis.zip . && cd ../../