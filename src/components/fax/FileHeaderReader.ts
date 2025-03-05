import Papa from 'papaparse';
import * as XLSX from 'xlsx/xlsx.mjs';

export async function readFileHeaders(file: File): Promise<string[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!file) {
    throw new Error('No file provided');
  }

  if (extension === 'csv' || extension === 'txt') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        preview: 1,
        header: false,
        skipEmptyLines: true,
        error: (error) => reject(new Error(`CSV parsing error: ${error.message}`)),
        complete: (results) => {
          if (results.data && Array.isArray(results.data) && results.data[0]) {
            resolve(results.data[0] as string[]);
          } else {
            reject(new Error('No headers found in CSV file'));
          }
        }
      });
    });
  } 
  
  if (extension === 'xlsx' || extension === 'xls') {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      if (!workbook.SheetNames.length) {
        throw new Error('Excel file contains no sheets');
      }
      
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!firstSheet) {
        throw new Error('First sheet is empty');
      }

      const range = XLSX.utils.decode_range(firstSheet['!ref'] || 'A1');
      const headers: string[] = [];
      
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = firstSheet[XLSX.utils.encode_cell({ r: 0, c: C })];
        headers.push(cell ? String(cell.v).trim() : '');
      }

      if (headers.length === 0) {
        throw new Error('No headers found in Excel file');
      }

      return headers;
    } catch (error) {
      throw new Error(`Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  throw new Error(`Unsupported file format: ${extension}`);
}

// Rest of the file remains the same...
