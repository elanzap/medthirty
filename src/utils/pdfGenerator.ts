import jsPDF from 'jspdf';
import type { Prescription, LabInvoice } from '../types';
import { getGlobalSettings } from '../stores/globalSettingsStore';

const formatPrescriptionDetails = (prescription: Partial<Prescription>) => {
  const globalSettings = getGlobalSettings();
  const doctor = {
    name: globalSettings.doctorName || 'Dr. Ram Kumar',
    qualifications: globalSettings.doctorQualifications || 'MBBS, MD, MPH (USA)',
    regNo: globalSettings.doctorRegNo || 'Regd No: 54371',
    specialization: globalSettings.doctorSpecialization || 'Physician & Consultant (General Medicine)'
  };

  // Ensure we get patient details from all possible sources
  const patientName = prescription.patientName || prescription.patient?.name || 'Unknown Patient';
  const patientGender = prescription.gender || prescription.patient?.gender || 'Not Specified';
  const patientAge = prescription.age || prescription.patient?.age?.toString() || 'Not Specified';
  const patientPhone = prescription.phone || prescription.patient?.phoneNumber || 'Not Provided';

  return {
    clinic: {
      name: globalSettings.clinicName || 'Suguna Clinic',
      address: globalSettings.clinicAddress || 'Vinayak Nagar, Hyderabad',
      location: globalSettings.clinicLocation || 'Hyderabad, Telangana',
      phone: globalSettings.clinicPhone || 'Ph: 9618994555',
      website: globalSettings.clinicWebsite || 'Website: sugunaclinic.com'
    },
    doctor,
    prescription: {
      id: prescription.prescriptionId || `OPD${Date.now()}`,
      date: new Date().toLocaleDateString(),
      visitId: prescription.visitId || `OCID${Date.now()}`,
      patientDetails: {
        name: patientName,
        gender: patientGender,
        age: patientAge,
        weight: prescription.vitalSigns?.weight || '',
        bp: prescription.vitalSigns?.bloodPressure || '',
        temperature: prescription.vitalSigns?.temperature ? `${prescription.vitalSigns.temperature} F` : '',
        phone: patientPhone,
        allergies: prescription.knownAllergies || ''
      },
      symptoms: prescription.symptoms || '',
      medications: prescription.medications || [],
      labTests: prescription.labTests || [],
      advice: prescription.advice || ''
    }
  };
};

export const generatePrescriptionPDF = async (prescription: Partial<Prescription>, returnBlob: boolean = false): Promise<{ blob: Blob; url: string } | void> => {
  if (!prescription) {
    console.error('No prescription provided');
    throw new Error('No prescription provided');
  }

  const doc = new jsPDF();
  const details = formatPrescriptionDetails(prescription);
  
  // Add clinic logo if available
  const clinicLogo = getGlobalSettings().clinicLogo;
  if (clinicLogo) {
    try {
      doc.addImage(clinicLogo, 'PNG', 15, 10, 30, 30);
    } catch (error) {
      console.error('Error adding clinic logo:', error);
    }
  }

  // Header - Clinic Details (Left Side)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(details.clinic.name, 50, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(details.clinic.address, 50, 25);
  doc.text(details.clinic.location, 50, 30);
  doc.text(details.clinic.phone, 50, 35);
  doc.text(details.clinic.website, 50, 40);

  // Header - Doctor Details (Right Side)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(details.doctor.name, 140, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(details.doctor.qualifications, 140, 25);
  doc.text(details.doctor.specialization, 140, 30);
  doc.text(details.doctor.regNo, 140, 35);

  // Prescription Details
  doc.line(15, 45, 195, 45); // Horizontal line

  // Prescription ID and Date
  doc.setFontSize(10);
  doc.text(`Prescription ${details.prescription.id}`, 15, 55);
  doc.text(`Date : ${details.prescription.date}`, 140, 55);

  // Patient Details - Left Column
  let y = 65;
  doc.text('OPD ID', 15, y);
  doc.text(': ' + details.prescription.id, 60, y);
  doc.text('OPD Visit ID', 110, y);
  doc.text(': ' + details.prescription.visitId, 160, y);

  y += 7;
  doc.text('Patient Name', 15, y);
  doc.text(': ' + details.prescription.patientDetails.name, 60, y);
  doc.text('Age', 110, y);
  doc.text(': ' + details.prescription.patientDetails.age + ' years', 160, y);

  y += 7;
  doc.text('Gender', 15, y);
  doc.text(': ' + details.prescription.patientDetails.gender, 60, y);
  doc.text('Phone', 110, y);
  doc.text(': ' + details.prescription.patientDetails.phone, 160, y);

  y += 7;
  doc.text('BP', 15, y);
  doc.text(': ' + details.prescription.patientDetails.bp, 60, y);
  doc.text('Temperature', 110, y);
  doc.text(': ' + details.prescription.patientDetails.temperature, 160, y);

  y += 7;
  doc.text('Weight', 15, y);
  doc.text(': ' + details.prescription.patientDetails.weight + ' kg', 60, y);
  doc.text('Allergies', 110, y);
  doc.text(': ' + details.prescription.patientDetails.allergies, 160, y);

  y += 7;
  doc.text('Consultant Doctor', 15, y);
  doc.text(': ' + details.doctor.name, 60, y);

  // Symptoms 
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Symptoms:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(details.prescription.symptoms, 25, y + 7);

  // Medications
  y += 25;
  doc.setFont('helvetica', 'bold');
  doc.text('Medicines', 15, y);

  // Medication Table Headers
  y += 7;
  doc.setFontSize(9);
  doc.text('#', 15, y);
  doc.text('Category', 25, y);
  doc.text('Medicine', 45, y);
  doc.text('Dosage', 105, y);
  doc.text('Interval', 130, y);
  doc.text('Duration', 160, y);
  doc.text('Instruction', 185, y);

  // Medication Rows
  doc.setFont('helvetica', 'normal');
  details.prescription.medications.forEach((med, index) => {
    y += 7;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text((index + 1).toString(), 15, y);
    doc.text('Tab', 25, y);
    doc.text(med.name, 45, y);
    doc.text(med.dosage, 105, y);
    doc.text(med.interval, 130, y);
    doc.text(med.duration, 160, y);
    doc.text(med.instructions, 185, y);
  });

  // Lab Tests
  if (details.prescription.labTests.length > 0) {
    y += 15;
    doc.setFont('helvetica', 'bold');
    doc.text('Pathology Test', 15, y);
    details.prescription.labTests.forEach((test, index) => {
      y += 7;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'normal');
      doc.text(`${index + 1}. ${test}`, 15, y);
    });
  }

  // Additional Advice
  if (details.prescription.advice) {
    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.text(details.prescription.advice, 15, y);
  }

  // Return blob and URL or save file
  if (returnBlob) {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    return { blob, url };
  } else {
    const filename = `prescription-${details.prescription.id}-${Date.now()}.pdf`;
    try {
      doc.save(filename);
      console.log(`PDF saved: ${filename}`);
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw error;
    }
  }
};

export const generateLabInvoicePDF = async (
  invoice: LabInvoice, 
  diagnosticTests: Array<{name: string, price: number}>, 
  returnBlob: boolean = false
): Promise<{ blob: Blob; url: string } | void> => {
  console.log('Generating Lab Invoice PDF', { invoice, diagnosticTests });

  // Validate inputs
  if (!invoice) {
    console.error('No invoice provided');
    throw new Error('No invoice provided');
  }

  if (!diagnosticTests || diagnosticTests.length === 0) {
    console.error('No diagnostic tests provided');
    throw new Error('No diagnostic tests provided');
  }

  const doc = new jsPDF();
  const globalSettings = getGlobalSettings();

  // Validate global settings
  if (!globalSettings) {
    console.error('Global settings not found');
    throw new Error('Global settings not found');
  }

  // Set document properties
  doc.setFontSize(12);

  // Background color for header
  doc.setFillColor(240, 240, 240); // Light gray
  doc.rect(0, 0, 210, 50, 'F');

  // Header
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0); // Black
  doc.setFont('helvetica', 'bold');
  doc.text(globalSettings.labName || 'Medical Laboratory', 105, 25, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50); // Dark gray
  doc.text(globalSettings.labAddress || 'Address Not Available', 105, 35, { align: 'center' });
  doc.text(`Phone: ${globalSettings.labPhone || 'N/A'}`, 105, 42, { align: 'center' });

  // Invoice Details with subtle border
  doc.setDrawColor(200, 200, 200); // Light border color
  doc.setLineWidth(0.5);
  doc.line(15, 55, 195, 55);

  doc.setTextColor(0, 0, 0); // Black
  doc.setFontSize(10);
  doc.text(`Invoice No: ${invoice.id}`, 15, 65);
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 150, 65, { align: 'right' });

  // Patient Details with background
  doc.setFillColor(250, 250, 250); // Very light gray
  doc.rect(15, 75, 180, 25, 'F');
  
  doc.setTextColor(0, 0, 0); // Black
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Details', 20, 85);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${invoice.patientName}`, 20, 92);
  doc.text(`Prescription ID: ${invoice.prescriptionId || 'N/A'}`, 150, 92, { align: 'right' });

  // Tests Details with alternating row colors
  doc.setFont('helvetica', 'bold');
  doc.text('Tests', 15, 110);

  let yPos = 120;
  invoice.tests.forEach((test, index) => {
    const testDetails = diagnosticTests.find(t => t.name === test);
    const price = testDetails?.price || 0;
    
    // Alternate background colors
    doc.setFillColor(index % 2 === 0 ? 245 : 255, 245, 245);
    doc.rect(15, yPos - 5, 180, 7, 'F');
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`${index + 1}. ${test}`, 20, yPos);
    doc.text(`₹${price.toFixed(2)}`, 190, yPos, { align: 'right' });
    yPos += 7;
  });

  // Totals section with border
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPos + 5, 195, yPos + 5);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  
  doc.text('Subtotal:', 20, yPos + 15);
  doc.text(`₹${invoice.subtotal.toFixed(2)}`, 190, yPos + 15, { align: 'right' });

  doc.text('Discount:', 20, yPos + 22);
  doc.text(`${invoice.discount}%`, 190, yPos + 22, { align: 'right' });

  doc.text('Total:', 20, yPos + 29, { style: 'bold' });
  doc.setTextColor(0, 100, 0); // Dark green for total
  doc.text(`₹${invoice.total.toFixed(2)}`, 190, yPos + 29, { align: 'right' });

  // Footer with watermark
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  doc.text('Powered by MedThirthy', 105, 285, { align: 'center' });

  // Watermark
  doc.setTextColor(230, 230, 230);
  doc.setFontSize(50);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 105, 160, { align: 'center', angle: 45, opacity: 0.1 });

  // Return or open PDF
  if (returnBlob) {
    const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return { blob, url };
  } else {
    try {
      // Explicitly open PDF in a new window
      const pdfDataUri = doc.output('datauristring');
      const newWindow = window.open('', '_blank');
      
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Lab Invoice</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f0f0; }
                iframe { box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 10px; }
              </style>
            </head>
            <body>
              <iframe 
                src="${pdfDataUri}" 
                width="80%" 
                height="90%" 
                style="border: none;"
              ></iframe>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        console.error('Popup blocked. Unable to open PDF.');
        alert('Please allow popups to view the invoice.');
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      throw error;
    }
  }
};
