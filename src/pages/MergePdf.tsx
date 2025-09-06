import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

const MergePdf = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [mergedPdf, setMergedPdf] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      // Add a toast notification here
      return;
    }

    const mergedDoc = await PDFDocument.create();
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedDoc.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedDoc.addPage(page));
    }

    const mergedPdfBytes = await mergedDoc.save();
    const mergedPdfBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);
    setMergedPdf(mergedPdfUrl);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {t("tools.merge_pdf.title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t("tools.merge_pdf.description")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("common.select_files")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input type="file" multiple onChange={handleFileChange} accept=".pdf" />
            <div className="flex flex-col gap-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{file.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={handleMerge} disabled={files.length < 2}>
              {t("tools.merge_pdf.title")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {mergedPdf && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">{t("common.merged_pdf")}</h2>
          <div className="flex flex-col gap-4">
            <iframe src={mergedPdf} className="w-full h-[600px] border rounded-md" />
            <a href={mergedPdf} download="merged.pdf">
              <Button>{t("common.download")}</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MergePdf;
