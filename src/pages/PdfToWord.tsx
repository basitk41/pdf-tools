import { useState, useCallback } from 'react';
import ToolPageLayout from '../components/tool-page/ToolPageLayout';
import FileUpload from '../components/tool-page/FileUpload';
import PrivacyDisclaimer from '../components/tool-page/PrivacyDisclaimer';
import FeedbackButton from '../components/tool-page/FeedbackButton';
import { Button } from '@/components/ui/button';
import { FileType } from 'lucide-react';
import axios from 'axios';
import FormData from 'form-data';

// --- Start of embedded ConvertApi logic ---
interface Credentials {
  secret?: string;
  apiKey?: string;
  token?: string;
}

interface IParamInit {
  Name: string;
  Value: string;
}

class Params {
  public dto: { Parameters: IParamInit[] };

  constructor(init?: IParamInit[]) {
    this.dto = { Parameters: init || [] };
  }

  add(name: string, value: string) {
    this.dto.Parameters.push({ Name: name, Value: value });
  }
}

interface IParams {
  dto: { Parameters: IParamInit[] };
}

interface ConvertApiFileResult {
  Url: string;
  FileName: string;
  FileSize: number;
}

interface ConvertApiResultDto {
  Files: ConvertApiFileResult[];
}

// Helper function to read a File/Blob as a Base64 string
const readFileAsBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]); // Extract Base64 part
      } else {
        reject(new Error('Failed to read file as string.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

class Result {
  public files: ConvertApiFileResult[];

  constructor(dto: ConvertApiResultDto) {
    this.files = dto.Files || [];
  }
}

class ConvertApi {
  constructor(
    public readonly credentials: Credentials,
    public readonly host: string = 'v2.convertapi.com'
  ) {}

  public createParams(init?: IParamInit[]): Params {
    return new Params(init);
  }

  public convert(
    fromFormat: string,
    toFormat: string,
    params: IParams
  ): Promise<Result> {
    return Promise.resolve(params.dto).then((dto) => {
      const altConvParam = dto.Parameters.filter(
        (p) => p.Name.toLowerCase() == 'converter'
      );
      const converterPath =
        altConvParam?.length > 0 ? `/converter/${altConvParam[0].Value}` : '';

      const authString = this.credentials.secret
        ? `secret=${this.credentials.secret}`
        : `apikey=${this.credentials.apiKey}&token=${this.credentials.token}`;
      return fetch(
        `https://${this.host}/convert/${fromFormat}/to/${toFormat}${converterPath}?${authString}&storefile=true`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(dto),
        }
      )
        .then((resp) => resp.json())
        .then((dto: ConvertApiResultDto) => new Result(dto)); // Cast dto to ConvertApiResultDto
    });
  }
}

function auth(credentials: Credentials, host?: string): ConvertApi {
  return new ConvertApi(credentials, host);
}
// --- End of embedded ConvertApi logic ---

function PdfToWord() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [docxUrl, setDocxUrl] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setSelectedFiles(Array.from(e.target.files));
      }
    },
    []
  );

  const handleConvert = async (file: File) => {
    if (!file) return;
    setIsConverting(true);

    const formData = new FormData();
    formData.append('File', file);

    try {
      const response = await axios.post(
        'https://v2.convertapi.com/convert/pdf/to/docx?Secret=yR9zQsG6TLSuHHUA76LRQeZGj4mysh0p',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const fileData = response.data.Files[0].FileData; // base64 string
      const fileName = response.data.Files[0].FileName;

      // Convert base64 → Blob
      const byteCharacters = atob(fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      setDocxUrl(url);
      setIsConverting(false);

      // Auto-download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Error:', error.response?.data || error.message);
    }
  };

  return (
    <ToolPageLayout
      icon={<FileType className='text-blue-600 w-8 h-8' />}
      title='PDF to Word Converter'
      description='Easily convert your PDF files to editable Word documents.'
    >
      <FileUpload
        onFileChange={handleFileChange}
        fileType='.pdf'
        multiple={false}
      />
      {selectedFiles.length > 0 && (
        <div className='text-center my-6'>
          <span className='text-gray-600'>{selectedFiles[0].name}</span>
        </div>
      )}
      <div className='text-center my-6'>
        <Button
          onClick={() => handleConvert(selectedFiles[0])}
          disabled={selectedFiles.length === 0 || isConverting}
          className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          {isConverting ? 'Converting...' : 'Convert to Word'}
        </Button>
        {docxUrl && (
          <div className='mt-4'>
            <a
              href={docxUrl}
              className='text-blue-600'
              target='_blank'
              rel='noopener noreferrer'
            >
              Download Word Document
            </a>
          </div>
        )}
      </div>
      <PrivacyDisclaimer />
      <FeedbackButton />
    </ToolPageLayout>
  );
}

export default PdfToWord;
