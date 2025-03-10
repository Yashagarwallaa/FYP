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

    // Split transcript into multiple lines
    const transcriptLines: string[] = pdf.splitTextToSize(transcript, 180);

    transcriptLines.forEach((line: string) => {
        if (y + lineHeight > pageHeight - margin) {
            pdf.addPage();
            y = margin;
        }

        pdf.text(line, margin, y);
        y += lineHeight;
    });

    // Download the generated PDF
    pdf.save(`${fileName}.pdf`);
}
