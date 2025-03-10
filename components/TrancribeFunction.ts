'use client';

import axios from 'axios';

interface DownloadMP3Params {
    url: string;
}

export function useDownloadMP3() {
    const downloadMP3 = async ({ url }: DownloadMP3Params) => {
        if (!url) {
            console.error('URL is required.');
            return;
        }

        try {
            const response = await axios.get(`/api/getAudio?url=${encodeURIComponent(url)}`, {
                responseType: 'arraybuffer',
            });
            
            const blob = new Blob([response.data], { type: 'audio/mpeg' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'downloaded_audio.mp3';
           
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log('Download successful.');
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return { downloadMP3 };
}

export const getTranscript = async (file: File): Promise<string | null> => {
    if (!file) {
        console.error('No file provided.');
        return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    console.log('FormData:', [...formData.entries()]);
    try {
        const response = await fetch('/api/getTranscript', {
            method: 'POST',
            body: formData,
        });
        console.log(response)
        const data = await response.json();
        return data.transcript || null;
    } catch (error) {
        console.error('Error fetching transcript:', error);
        return null;
    }
};

export async function getSummary(transcript: string) {
    try {
        const response = await fetch('/api/getSummary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript }),
        });

        const data = await response.json();
        if (data.summary) {
            return data.summary;
        } else {
            console.error('Error:', data.error);
            return null;
        }
    } catch (error) {
        console.error('Error fetching summary:', error);
        return null;
    }
}

