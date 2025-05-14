import { jsPDF } from 'jspdf';

export default function getPDF(transcript: string, fileName: string, title: string) {
    if (!transcript) {
        console.error('Error: Transcript is empty.');
        return;
    }

    const pdf = new jsPDF();

    // Title formatting
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text(title, 10, 10);
     
   
    // Transcript formatting
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);

    const margin = 10;
    const pageHeight = pdf.internal.pageSize.height;
    const lineHeight = 8; // Approximate line height for 12px text size
    let y = 20;

    if(title=='Meeting Transcript'){
        const transcriptLines: string[] = transcript.split('\n');
        transcriptLines.forEach((line: string) => {
            // Extract speaker and text using a simple regex or split
            const match = line.match(/^Speaker (\d+): (.*)/);
            if (match) {
                const speaker = match[1];
                const text = match[2];
    
                // Bold speaker name
                pdf.setFont('helvetica', 'bold');
                pdf.text(`Speaker ${speaker}:`, margin, y);
    
                // Normal spoken text (offset to the right)
                pdf.setFont('helvetica', 'normal');
    
                // Wrap text to avoid overflow
                const wrappedText = pdf.splitTextToSize(text, 180 - 40); // Leave room for indent
                wrappedText.forEach((wrappedLine: string, i: number) => {
                    const lineY = y + i * lineHeight;
                    if (lineY + lineHeight > pageHeight - margin) {
                        pdf.addPage();
                        y = margin;
                    }
                    pdf.text(wrappedLine, margin + 40, lineY);
                });
    
                // Move y by total height of the block
                y += lineHeight * wrappedText.length;
            } else {
                // Fallback for non-matching lines
                pdf.setFont('helvetica', 'normal');
                const fallbackLines = pdf.splitTextToSize(line, 180);
                fallbackLines.forEach((fallbackLine: string) => {
                    if (y + lineHeight > pageHeight - margin) {
                        pdf.addPage();
                        y = margin;
                    }
                    pdf.text(fallbackLine, margin, y);
                    y += lineHeight;
                });
            }
        });
    }
    else {
        const transcriptLines: string[] = pdf.splitTextToSize(transcript, 180);

    transcriptLines.forEach((line: string) => {
        if (y + lineHeight > pageHeight - margin) {
            pdf.addPage();
            y = margin;
        }

        pdf.text(line, margin, y);
        y += lineHeight;
    });
    }
    // Download the generated PDF
    pdf.save(`${fileName}.pdf`);
}
