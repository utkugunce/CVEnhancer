const fs = require('fs');
const PDFParser = require('pdf2json');

const pdfPath = './Utku Gunce - CV.pdf';
const parser = new PDFParser(null, 1);

parser.on('pdfParser_dataError', (errData) => console.error(errData.parserError));
parser.on('pdfParser_dataReady', (pdfData) => {
    fs.writeFileSync('pdf-dump.json', JSON.stringify(pdfData, null, 2));
    console.log('Dumped full PDF data to pdf-dump.json');
});

parser.loadPDF(pdfPath);
