'use client'

import { Button, Flex, Heading, Input, Select, useColorModeValue } from "@chakra-ui/react";
import { parse } from 'csv-parse/sync';
import { Dispatch, SetStateAction, useState } from "react";
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

  const [option, setOption] = useState<ConvertOption>({
    encoding: "utf8",
    delimiter: ",",
  });

  const handleConvertButton = () => {
    if (!file) return;
    convertAndDownload({file: file, option: option});
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
        gap={2}
      >
        <Heading mb={6}>CONVERT .csv TO .xlsx</Heading>
        <Input variant="filled" mb={2} type="file" onChange={handleFileChangeButton}/>
        <Button colorScheme="teal" onClick={handleConvertButton}>convert!</Button>
        <InputOptionArea option={option} setOption={setOption}/>
      </Flex>
    </Flex>
  );
};

interface InputOptionArea {
  option: ConvertOption;
  setOption: Dispatch<SetStateAction<ConvertOption>>
};
function InputOptionArea(props: InputOptionArea) {
  const option = props.option;
  const setOption = props.setOption
  return (
    <Flex
      direction="column"
      p="4"
      rounded={6}
      background={useColorModeValue("gray.200", "gray.600")}
    >
      <Heading size='md'>Options</Heading>
      <OptionSelect 
        label="Encoding" 
        value={option.encoding} 
        options={[
          { value: "utf8", label: "UTF-8" },
          { value: "ucs2", label: "UCS-2" },
          { value: "utf16le", label: "UTF-16LE" },
          { value: "latin1", label: "Latin1" },
          { value: "ascii", label: "ASCII" }
        ]}
        onChange={(value) => setOption({ ...option, encoding: value as ConvertOption["encoding"] })}
      />
      <OptionSelect 
        label="Delimiter" 
        value={option.delimiter} 
        options={[
          { value: ",", label: "," },
          { value: "\t", label: "tab" }
        ]}
        onChange={(value) => setOption({ ...option, delimiter: value as "," | "/t" })}
      />
    </Flex>
  );
}

interface OptionSelectProps {
  label: string;
  value: string;
  options: { value: string, label: string }[];
  onChange: (value: string) => void;
}
function OptionSelect(props: OptionSelectProps) {
  return (
    <Flex direction="column" gap={2}>
      <Heading size="sm">{props.label}</Heading>
      <Select value={props.value} onChange={(event) => props.onChange(event.target.value)}>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </Select>
    </Flex>
  );
}


interface ConvertOption {
  encoding: "utf8" | "ucs2" | "utf16le" | "latin1" | "ascii",
  delimiter: "," | "/t",
  // TODO
};
interface convertAndDownloadProps {
  file: File;
  option: ConvertOption;
}
function convertAndDownload(props: convertAndDownloadProps) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const csvData = event.target?.result as string;

    const aoa = parse(csvData, {
      encoding: props.option.encoding,
      delimiter: props.option.delimiter,
    });
    const wbout = createWorkbook(aoa);
    downloadExcel(wbout);
  };

  reader.readAsText(props.file);
}

function createWorkbook(aoa: string[][]) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Converted from CSV");

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
