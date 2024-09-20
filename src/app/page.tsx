'use client'

import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { Button, Flex, FlexProps, Heading, Input, ListItem, Select, UnorderedList, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { parse } from "csv-parse/sync";
import { Dispatch, SetStateAction, useState } from "react";
import * as XLSX from 'xlsx';

export default function Home() {
  const { toggleColorMode } = useColorMode();
  const formBackgroundMain = useColorModeValue("gray.100", "gray.700");
  const formBackgroundSub = useColorModeValue("gray.200", "gray.600");
  
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
    quote: "\"",
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
      direction="column"
    > 
      <Flex
        direction="column"
        background={formBackgroundMain}
        p="12"
        m="4"
        rounded={6}
        gap={2}
        width={["100%", "80%", "40em"]}
      >
        <Heading mb={6} size="2xl">CONVERT .csv TO .xlsx</Heading>
        <Input variant="filled" mb={2} type="file" onChange={handleFileChangeButton}/>
        <Button colorScheme="teal" onClick={handleConvertButton}>Convert!</Button>
        <InputOptionArea option={option} setOption={setOption}/>
      </Flex>
      <SubCardFlex>
        <Heading size="xl">What&apos;s this?</Heading>
        <p>This is a simple web app that converts .csv file to .xlsx file.</p>
        <p>Choose a .csv file and click the &quot;Convert!&quot; button.</p>
        <p>The converted file will be downloaded automatically.</p>
      </SubCardFlex>
      <SubCardFlex>
        <Heading size="xl">Why you need this?</Heading>
        <p>Excel can handle .csv file, but its behavior is not always as you expect.</p>
        
        <Heading size="md">Problems with Excel</Heading>
        <UnorderedList>
          <ListItem>Excel removes leading zeros from numbers.</ListItem>
          <ListItem>Excel converts long numbers to scientific notation.</ListItem>
          <ListItem>Excel converts date-like strings to date.</ListItem>
        </UnorderedList>

        <Heading size="md">Benefits of this tool</Heading>
        <p>you can avoid these problems by converting .csv to .xlsx with this tool.</p>
      </SubCardFlex>
      <SubCardFlex>
        <Heading size="xl">Is your data safe?</Heading>
        <p>Yes, your data is safe.</p>
        <p>All the conversion process is done on your browser.</p>
        <p>That is, your data is not sent to any server.</p> 
      </SubCardFlex>

      <SubCardFlex>
        <Heading size="xl">About this app</Heading>
        <p>This app is created by <Link color="teal.500" target="_blank" rel="noopener noreferrer" href="https://github.com/kamaoda">kamaoda<ExternalLinkIcon mx='2px' /></Link>.</p>
        <p>Source code is available on <Link color="teal.500" target="_blank" rel="noopener noreferrer" href="https://github.com/kamaoda/csv-to-excel-iikanzi">GitHub<ExternalLinkIcon mx='2px' /></Link>.</p>
        <p>Feel free to use and contribute to this app.</p>
      </SubCardFlex>
      <SubCardFlex>
        <Heading size="xl">OSS used in this app</Heading>
        <UnorderedList>
          <ListItem><Link color="teal.500" target="_blank" rel="noopener noreferrer" href="https://nextjs.org/">Next.js<ExternalLinkIcon mx='2px' /></Link></ListItem>
          <ListItem><Link color="teal.500" target="_blank" rel="noopener noreferrer" href="https://chakra-ui.com/">Chakra UI<ExternalLinkIcon mx='2px' /></Link></ListItem>
          <ListItem><Link color="teal.500" target="_blank" rel="noopener noreferrer" href="https://sheetjs.com">SheetJS<ExternalLinkIcon mx='2px' /></Link></ListItem>
        </UnorderedList>
      </SubCardFlex>
      <Button m={2} colorScheme="teal" onClick={toggleColorMode} mt={4}>Toggle Color Mode</Button>
    </Flex>
  );
};

/**
 * Card component with flex layout. Used for description cards.
 */
function SubCardFlex(props: FlexProps) {
  return (
    <Flex
      direction="column"
      p="6"
      m="2"
      rounded={6}
      gap={2}
      background={useColorModeValue("gray.200", "gray.600")}
      width={["100%", "80%", "40em"]}
      {...props}
    />
  );
}

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
      background={useColorModeValue("gray.300", "gray.600")}
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
        onChange={(value) => setOption({ ...option, delimiter: value as ConvertOption["delimiter"] })}
      />
      <OptionSelect 
        label="Quote" 
        value={option.quote} 
        options={[
          { value: "\"", label: "\"" },
          { value: "'", label: "'" },
          { value: "", label: "none" },
        ]}
        onChange={(value) => setOption({ ...option, quote: value as ConvertOption["quote"] })}
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
      <Select variant="filled" value={props.value} onChange={(event) => props.onChange(event.target.value)}>
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
  quote: "\"" | "'",
  // TODO add more options
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

function createWorkbook(aoa: string[][]) : BlobPart {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Converted from CSV");

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return wbout;
}

function downloadExcel(wbout: BlobPart) {
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
