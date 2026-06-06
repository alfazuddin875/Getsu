import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const downloadCard = async (element: HTMLElement, filename: string, type: 'jpeg' | 'pdf') => {
  try {
    // We increase scale for better resolution
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#1e1b4b', // matches indigo-950 approx
      imageTimeout: 15000,
    });

    if (type === 'jpeg') {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.download = `${filename}.jpg`;
      link.href = dataUrl;
      link.click();
    } else if (type === 'pdf') {
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      // Dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2] // match html
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`${filename}.pdf`);
    }
  } catch (error) {
    console.error('Error generating file:', error);
    alert('Failed to generate file. Some images might not be loaded due to CORS.');
  }
};
