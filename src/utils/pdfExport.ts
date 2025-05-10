
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

export interface ExportOptions {
  title?: string;
  subtitle?: string;
  includeTimestamp?: boolean;
}

export const exportToPDF = async (options: ExportOptions = {}) => {
  // Default options
  const {
    title = 'Activity Dashboard Report',
    subtitle = 'Generated from Insight Haven',
    includeTimestamp = true,
  } = options;

  try {
    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add title and metadata
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(44, 62, 80);
    pdf.text(title, 20, 20);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(subtitle, 20, 30);
    
    // Add timestamp if requested
    if (includeTimestamp) {
      const timestamp = new Date().toLocaleString();
      pdf.text(`Generated: ${timestamp}`, 20, 40);
    }
    
    // Add a decorative line
    pdf.setDrawColor(52, 152, 219);
    pdf.setLineWidth(0.5);
    pdf.line(20, 45, 190, 45);
    
    // Find all chart containers in the document
    const chartElements = document.querySelectorAll('.recharts-wrapper');
    
    if (chartElements.length === 0) {
      throw new Error('No charts found to export');
    }
    
    // Process each chart - one chart per page
    for (let i = 0; i < chartElements.length; i++) {
      const chartElement = chartElements[i];
      
      // Add a new page for each chart (except for the first one)
      if (i > 0) {
        pdf.addPage();
      }
      
      // Reset Y position for each page
      let currentY = 60;
      
      // Find the chart title from the parent card
      let chartTitle = '';
      const cardHeader = chartElement.closest('.card')?.querySelector('.card-title');
      if (cardHeader) {
        chartTitle = cardHeader.textContent || `Chart ${i + 1}`;
      } else {
        chartTitle = `Chart ${i + 1}`;
      }
      
      // Find chart description if available
      let chartDescription = '';
      const cardDescription = chartElement.closest('.card')?.querySelector('.card-description');
      if (cardDescription) {
        chartDescription = cardDescription.textContent || '';
      }
      
      // Capture the chart as an image with better quality settings
      const canvas = await html2canvas(chartElement as HTMLElement, {
        scale: 3, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        removeContainer: false
      });
      const imageData = canvas.toDataURL('image/png');
      
      // Add chart title with style
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(44, 62, 80);
      pdf.text(chartTitle, 20, currentY);
      currentY += 8;
      
      // Add chart description if available
      if (chartDescription) {
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(chartDescription, 20, currentY);
        currentY += 8;
      }
      
      // Calculate dimensions to maintain aspect ratio but fit on page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imageWidth = Math.min(pageWidth - 40, 170); // Max width with margins
      const ratio = canvas.width / canvas.height;
      const imageHeight = imageWidth / ratio;
      
      // Add the chart image
      pdf.addImage(imageData, 'PNG', 20, currentY, imageWidth, imageHeight);
      
      // Add a border around the chart
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.3);
      pdf.rect(20, currentY, imageWidth, imageHeight);
    }
    
    // Add page numbers
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${i} of ${totalPages}`, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 10);
    }
    
    // Save the PDF
    pdf.save('dashboard_export.pdf');
    return { success: true };
    
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return { success: false, error };
  }
};
