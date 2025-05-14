import { NextRequest, NextResponse } from 'next/server';
import { AssemblyAI } from "assemblyai";
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { promises as fs2 } from 'fs';

import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'downloads', 'downloaded_audio.mp3');
        
        if (!fs.existsSync(filePath)) {
            console.error('❌ File not found at:', filePath);
            return NextResponse.json({ error: 'Audio file not found' }, { status: 404 });
        }

        // const data = new FormData();
        // data.append('file', fs.createReadStream(filePath));
        // data.append('model', 'whisper-1');

        // const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', data, {
        //     headers: {
        //         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        //         ...data.getHeaders(),
        //     },
        // });
        
        const baseUrl = "https://api.assemblyai.com";
        
        const headers = {
          authorization: process.env.ASSEMBLY_AI_API_KEY,
        };
        
       
        const audioData = await fs2.readFile(filePath);
        const uploadResponse = await axios.post(`${baseUrl}/v2/upload`, audioData, {
          headers,
        });
        const audioUrl = uploadResponse.data.upload_url;
        
        
        const data = {
          audio_url: audioUrl,
          speaker_labels:true,
          language_detection: true
        };
        
        const url = `${baseUrl}/v2/transcript`;
        const response = await axios.post(url, data, { headers: headers });
        
        const transcriptId = response.data.id;
        const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;
        
        let x ="";
        while (true) {
          const pollingResponse = await axios.get(pollingEndpoint, {
            headers: headers,
          });
          const transcriptionResult = pollingResponse.data;
        
          if (transcriptionResult.status === "completed") {
            for (const utterance of transcriptionResult.utterances) {
              x += `Speaker ${utterance.speaker}: ${utterance.text}\n`;
              
            }
            break;
          } else if (transcriptionResult.status === "error") {
            throw new Error(`Transcription failed: ${transcriptionResult.error}`);
          } else {
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
        }
        

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err.message}`);
            } else {
                console.log(`File deleted successfully: ${filePath}`);
            }
        });
        return NextResponse.json({ transcript:x });

    } catch (error: any) {
        console.error('❌ Error generating transcript:', error.response?.data || error.message);
        return NextResponse.json({
            error: error.response?.data?.error?.message || 'Failed to generate transcript'
        }, { status: 500 });
    }
}
