import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { transcript } = await req.json();
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!transcript) {
        return NextResponse.json({ error: 'Transcript not provided' }, { status: 400 });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert meeting summarizer. Provide a concise summary with key points."
                    },
                    {
                        role: "user",
                        content: `Summarize this transcript: ${transcript}`
                    }
                ],
                max_tokens: 1500
            })
        });

        const data = await response.json();
         console.log(data.choices[0].message.content );
        if (response.ok) {
            return NextResponse.json({ summary: data.choices[0].message.content });
        } else {
            return NextResponse.json({ error: data.error.message }, { status: 500 });
        }

    } catch (error) {
        console.error('Error generating summary:', error);
        return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
    }
}
