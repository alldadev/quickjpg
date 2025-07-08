import { Progress } from "@/components/ui/progress";

interface ConversionProgressProps {
  progress: number;
  fileName: string;
}

export default function ConversionProgress({ progress, fileName }: ConversionProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="truncate">{fileName}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
