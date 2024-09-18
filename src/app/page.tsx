'use client'

import { Button, Flex, Heading, Input, useColorModeValue } from "@chakra-ui/react";
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
    console.log('convert');
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target?.result as string;
      const aoa = [ // FIXME: Convert csvData to aoa
        ['Hello1', 'World1'],
        ['Hello2', 'World2', 'guys2'],
        ['Hello3', 'World3', 'guys3', 'and3'],
        ['0004', '1-2-3', ',"', ''],
      ];
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(aoa);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Converted from CSV");

      // Create a Blob from the workbook
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });

      // Create a link element and trigger a download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    reader.readAsText(file);
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
        <Heading mb={6}>CSVをいい感じの.xlsxに変換する君</Heading>
        <Input variant="filled" mb={2} type="file" onChange={handleFileChangeButton}/>
        <Button colorScheme="teal" onClick={handleConvertButton}>変換！</Button>
      </Flex>
    </Flex>
  );
};