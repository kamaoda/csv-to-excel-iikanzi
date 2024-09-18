'use client'

import { Button, Flex, Heading, Input, useColorModeValue } from "@chakra-ui/react";
import { parse } from 'csv-parse/sync';
import { useState } from "react";
import * as XLSX from 'xlsx';

export default function Home() {
  const formBackground = useColorModeValue("gray.100", "gray.700");
  
  const [file, setFile] = useState<File | null>(null);

  const handleFileChangeButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleConvertButton = () => {
    if (!file) return;
    convertAndDownload(file);
  };

  return (
    <Flex 
      minHeight="100dvh"
      alignItems="center"
      justifyContent="center"
    > 
      <Flex
        direction="column"
        background={formBackground}
        p="12"
        rounded={6}
      >
        <Heading mb={6}>CONVERT .csv TO .xlsx</Heading>
        <Input variant="filled" mb={2} type="file" onChange={handleFileChangeButton}/>
        <Button colorScheme="teal" onClick={handleConvertButton}>convert!</Button>
      </Flex>
    </Flex>
  );
};

function convertAndDownload(file: File) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const csvData = event.target?.result as string;

    const aoa = parse(csvData, {});
    const wbout = createWorkbook(aoa);
    downloadExcel(wbout);
  };

  reader.readAsText(file);
}

function createWorkbook(aoa: string[][]) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Converted from CSV");

  // Create a Blob from the workbook
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return wbout;
}

function downloadExcel(wbout: any) {
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'converted.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
