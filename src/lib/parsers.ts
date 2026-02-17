import mammoth from 'mammoth';

// 2. Fallback to 'pdf2json' if that fails.

export async function parsePDF(buffer: Buffer): Promise<string> {
  // Force use of pdf2json for now to avoid stubborn Type3 font crashing in pdf-parse
  try {
    /* eslint-disable @typescript-eslint/no-var-requires */
    const PDFParser = require('pdf2json');
    const parser = new PDFParser(null, 1);

    return new Promise((resolve, reject) => {
      parser.on('pdfParser_dataError', (errData: any) => reject(new Error(errData.parserError)));

      parser.on('pdfParser_dataReady', (pdfData: any) => {
        if (!pdfData) {
          reject(new Error('PDF parsing failed: No data returned.'));
          return;
        }

        // Handle different pdf2json versions / output structures
        // Sometimes it's pdfData.formImage.Pages, sometimes just pdfData.Pages
        const pages = pdfData.formImage?.Pages || pdfData.Pages;

        if (!pages) {
          console.error('PDF Structure Dump:', Object.keys(pdfData));
          reject(new Error('Invalid PDF structure: Pages not found.'));
          return;
        }

        let fullText = '';
        for (const page of pages) {
          if (page.Texts) {
            for (const textItem of page.Texts) {
              // R is an array of text runs
              if (textItem.R && textItem.R.length > 0) {
                try {
                  // T is the text content, URI encoded
                  fullText += decodeURIComponent(textItem.R[0].T) + ' ';
                } catch (e) {
                  fullText += textItem.R[0].T + ' ';
                }
              }
            }
          }
          fullText += '\n\n';
        }

        resolve(fullText.trim());
      });

      parser.parseBuffer(buffer);
    });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file.');
  }
}

export async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file.');
  }
}
