import { useState } from 'react';
import { Button } from './ui/button';
import { Download, Video, Square } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ExportPanelProps {
  onExportImage: () => void;
  onStartRecording: () => void;
  onStopRecording: () => string[];
}

export function ExportPanel({
  onExportImage,
  onStartRecording,
  onStopRecording,
}: ExportPanelProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(3);

  const handleRecord = async () => {
    setIsRecording(true);
    onStartRecording();

    // Record for specified duration
    await new Promise((resolve) => setTimeout(resolve, recordDuration * 1000));

    const frames = onStopRecording();
    setIsRecording(false);

    // Download frames as zip (simplified: download first and last frame)
    if (frames.length > 0) {
      // Download first frame
      const link1 = document.createElement('a');
      link1.download = `frame-0001.png`;
      link1.href = frames[0];
      link1.click();

      // Download last frame
      if (frames.length > 1) {
        const link2 = document.createElement('a');
        link2.download = `frame-${String(frames.length).padStart(4, '0')}.png`;
        link2.href = frames[frames.length - 1];
        link2.click();
      }

      // In a real app, you'd create a zip file or video here
      alert(
        `Recorded ${frames.length} frames. In production, these would be exported as a video or image sequence.`
      );
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={onExportImage}
        className="gap-2"
        variant="outline"
      >
        <Download className="size-4" />
        Export Image
      </Button>

      <Button
        onClick={handleRecord}
        disabled={isRecording}
        className="gap-2"
        variant={isRecording ? 'secondary' : 'default'}
      >
        {isRecording ? (
          <>
            <Square className="size-4" />
            Recording...
          </>
        ) : (
          <>
            <Video className="size-4" />
            Record ({recordDuration}s)
          </>
        )}
      </Button>
    </div>
  );
}