import { useEffect, useRef, useState } from 'react';
import { Controls } from './components/Controls';
import { ExportPanel } from './components/ExportPanel';
import { TextControls } from './components/TextControls';

export interface SketchParams {
  canvasWidth: number;
  canvasHeight: number;
  nCells: number;
  frameRate: number;
  pixelDensity: number;
  noiseScaleX: number;
  noiseScaleY: number;
  noiseScaleTime: number;
  noisePower: number;
  grainStrength: number;
  colors: string[];
  thresholds: number[];
  showStroke: boolean;
  strokeColor: string;
  strokeWidth: number;
}

export interface TextElement {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  align: 'left' | 'center' | 'right';
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const isRecordingRef = useRef(false);
  const recordedFramesRef = useRef<string[]>([]);

  const [params, setParams] = useState<SketchParams>({
    canvasWidth: 320,
    canvasHeight: 640,
    nCells: 150,
    frameRate: 10,
    pixelDensity: 1,
    noiseScaleX: 0.01,
    noiseScaleY: 0.01,
    noiseScaleTime: 0.03,
    noisePower: 1.5,
    grainStrength: 0.1,
    colors: ['#0A277A', '#FF634E', '#FB37B0', '#2239A6', '#4788DC'],
    thresholds: [2, 2.25, 3, 3.5, 5],
    showStroke: false,
    strokeColor: '#ffffff',
    strokeWidth: 1,
  });

  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: '1',
      content: 'POSTER',
      x: 50,
      y: 80,
      fontSize: 48,
      fontFamily: 'Space Grotesk',
      color: '#ffffff',
      align: 'left',
      fontWeight: 700,
      letterSpacing: -1,
      lineHeight: 1.1,
    },
  ]);

  // Perlin noise implementation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas internal resolution
    const width = params.canvasWidth;
    const height = params.canvasHeight;
    canvas.width = width;
    canvas.height = height;

    // Simple Perlin noise implementation
    const permutation = new Array(512);
    const p = new Array(256);
    for (let i = 0; i < 256; i++) {
      p[i] = Math.floor(Math.random() * 256);
    }
    for (let i = 0; i < 512; i++) {
      permutation[i] = p[i & 255];
    }

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (t: number, a: number, b: number) => a + t * (b - a);
    const grad = (hash: number, x: number, y: number, z: number) => {
      const h = hash & 15;
      const u = h < 8 ? x : y;
      const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };

    const noise = (x: number, y: number, z: number) => {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      const Z = Math.floor(z) & 255;
      x -= Math.floor(x);
      y -= Math.floor(y);
      z -= Math.floor(z);
      const u = fade(x);
      const v = fade(y);
      const w = fade(z);
      const A = permutation[X] + Y;
      const AA = permutation[A] + Z;
      const AB = permutation[A + 1] + Z;
      const B = permutation[X + 1] + Y;
      const BA = permutation[B] + Z;
      const BB = permutation[B + 1] + Z;

      return lerp(
        w,
        lerp(
          v,
          lerp(u, grad(permutation[AA], x, y, z), grad(permutation[BA], x - 1, y, z)),
          lerp(u, grad(permutation[AB], x, y - 1, z), grad(permutation[BB], x - 1, y - 1, z))
        ),
        lerp(
          v,
          lerp(u, grad(permutation[AA + 1], x, y, z - 1), grad(permutation[BA + 1], x - 1, y, z - 1)),
          lerp(u, grad(permutation[AB + 1], x, y - 1, z - 1), grad(permutation[BB + 1], x - 1, y - 1, z - 1))
        )
      );
    };

    const addGrain = (imageData: ImageData, strength: number) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 2 - 1) * strength * 255;
        data[i] = Math.max(0, Math.min(255, data[i] + v));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + v));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + v));
      }
    };

    const draw = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      const cWidth = width / params.nCells;
      const cHeight = height / params.nCells;

      for (let column = 0; column < params.nCells; column++) {
        for (let row = 0; row < params.nCells; row++) {
          let n = noise(
            column * params.noiseScaleX,
            row * params.noiseScaleY,
            frameCountRef.current * params.noiseScaleTime
          );

          // Normalize noise from [-1, 1] to [0, 1]
          n = (n + 1) / 2;
          n = Math.pow(n, params.noisePower) * 6;

          let currentColor = '#000000';
          if (n < params.thresholds[0]) {
            currentColor = params.colors[0];
          } else if (n < params.thresholds[1]) {
            currentColor = params.colors[1];
          } else if (n < params.thresholds[2]) {
            currentColor = params.colors[2];
          } else if (n < params.thresholds[3]) {
            currentColor = params.colors[3];
          } else if (n < params.thresholds[4]) {
            currentColor = params.colors[4];
          }

          const x = column * cWidth;
          const y = row * cHeight;

          ctx.fillStyle = currentColor;
          ctx.fillRect(x, y, Math.ceil(cWidth) + 0.5, Math.ceil(cHeight) + 0.5);

          if (params.showStroke) {
            ctx.strokeStyle = params.strokeColor;
            ctx.lineWidth = params.strokeWidth;
            ctx.strokeRect(x, y, cWidth, cHeight);
          }
        }
      }

      // Add grain
      if (params.grainStrength > 0) {
        const imageData = ctx.getImageData(0, 0, width, height);
        addGrain(imageData, params.grainStrength);
        ctx.putImageData(imageData, 0, 0);
      }

      // Draw text elements
      textElements.forEach((text) => {
        ctx.save();
        ctx.fillStyle = text.color;
        ctx.font = `${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
        ctx.textAlign = text.align;
        ctx.textBaseline = 'top';

        // Handle multi-line text
        const lines = text.content.split('\n');
        const lineHeightPx = text.fontSize * text.lineHeight;

        lines.forEach((line, index) => {
          const yPos = text.y + index * lineHeightPx;
          
          // Letter spacing (requires manual drawing)
          if (text.letterSpacing !== 0) {
            let xPos = text.x;
            const chars = line.split('');
            const totalWidth = chars.reduce((sum, char) => sum + ctx.measureText(char).width + text.letterSpacing, 0);
            
            if (text.align === 'center') {
              xPos = text.x - totalWidth / 2;
            } else if (text.align === 'right') {
              xPos = text.x - totalWidth;
            }
            
            chars.forEach((char) => {
              ctx.fillText(char, xPos, yPos);
              xPos += ctx.measureText(char).width + text.letterSpacing;
            });
          } else {
            ctx.fillText(line, text.x, yPos);
          }
        });
        
        ctx.restore();
      });

      // Capture frame if recording
      if (isRecordingRef.current) {
        recordedFramesRef.current.push(canvas.toDataURL('image/png'));
      }

      frameCountRef.current++;
    };

    let lastTime = 0;
    const frameInterval = 1000 / params.frameRate;

    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate);

      const elapsed = currentTime - lastTime;
      if (elapsed > frameInterval) {
        lastTime = currentTime - (elapsed % frameInterval);
        draw();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [params, textElements]);

  const handleExportImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `poster-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const handleStartRecording = () => {
    recordedFramesRef.current = [];
    isRecordingRef.current = true;
  };

  const handleStopRecording = () => {
    isRecordingRef.current = false;
    return recordedFramesRef.current;
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Text Controls Sidebar - Left */}
      <div className="w-80 bg-white border-r border-neutral-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-neutral-900 mb-1">Text Editor</h1>
            <p className="text-neutral-500 text-sm">Add and position text</p>
          </div>

          <TextControls 
            textElements={textElements} 
            setTextElements={setTextElements}
            canvasWidth={params.canvasWidth}
            canvasHeight={params.canvasHeight}
          />
        </div>
      </div>

      {/* Canvas Area - Center */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <canvas
          ref={canvasRef}
          style={{
            width: `${params.canvasWidth}px`,
            height: `${params.canvasHeight}px`,
          }}
          className="shadow-lg"
        />
        
        <div className="mt-6">
          <ExportPanel
            onExportImage={handleExportImage}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
        </div>
      </div>

      {/* Generative Controls Sidebar - Right */}
      <div className="w-80 bg-white border-l border-neutral-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-neutral-900 mb-1">Generative</h2>
            <p className="text-neutral-500 text-sm">Adjust visual parameters</p>
          </div>

          <Controls params={params} setParams={setParams} />
        </div>
      </div>
    </div>
  );
}
