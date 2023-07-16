// This file is used to parse the CSV data

import Papa from 'papaparse';

export const parseCSVData = (csvData) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true, // Assuming the CSV file has a header row
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};