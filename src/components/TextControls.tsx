import { TextElement } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Separator } from './ui/separator';

interface TextControlsProps {
  textElements: TextElement[];
  setTextElements: (elements: TextElement[]) => void;
  canvasWidth: number;
  canvasHeight: number;
}

const FONT_FAMILIES = [
  'Space Grotesk',
  'Inter',
  'JetBrains Mono',
  'Archivo Black',
  'Bebas Neue',
  'Oswald',
  'Roboto Mono',
];

export function TextControls({ textElements, setTextElements, canvasWidth, canvasHeight }: TextControlsProps) {
  const addTextElement = () => {
    const newElement: TextElement = {
      id: Date.now().toString(),
      content: 'New Text',
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      fontSize: 32,
      fontFamily: 'Space Grotesk',
      color: '#ffffff',
      align: 'center',
      fontWeight: 700,
      letterSpacing: 0,
      lineHeight: 1.2,
    };
    setTextElements([...textElements, newElement]);
  };

  const removeTextElement = (id: string) => {
    setTextElements(textElements.filter((el) => el.id !== id));
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(
      textElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  return (
    <div className="space-y-6">
      <Button onClick={addTextElement} className="w-full gap-2" variant="outline">
        <Plus className="size-4" />
        Add Text
      </Button>

      {textElements.map((element, index) => (
        <div key={element.id} className="space-y-4 p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-neutral-700">Text {index + 1}</h3>
            <Button
              onClick={() => removeTextElement(element.id)}
              variant="ghost"
              size="sm"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={element.content}
                onChange={(e) =>
                  updateTextElement(element.id, { content: e.target.value })
                }
                placeholder="Enter text..."
                className="min-h-20"
              />
            </div>

            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={element.fontFamily}
                onValueChange={(value) =>
                  updateTextElement(element.id, { fontFamily: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Size: {element.fontSize}px</Label>
              <Slider
                value={[element.fontSize]}
                onValueChange={([v]) =>
                  updateTextElement(element.id, { fontSize: v })
                }
                min={12}
                max={120}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Weight: {element.fontWeight}</Label>
              <Slider
                value={[element.fontWeight]}
                onValueChange={([v]) =>
                  updateTextElement(element.id, { fontWeight: v })
                }
                min={100}
                max={900}
                step={100}
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={element.color}
                  onChange={(e) =>
                    updateTextElement(element.id, { color: e.target.value })
                  }
                  className="w-16 h-9 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={element.color}
                  onChange={(e) =>
                    updateTextElement(element.id, { color: e.target.value })
                  }
                  className="flex-1 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Alignment</Label>
              <Select
                value={element.align}
                onValueChange={(value: 'left' | 'center' | 'right') =>
                  updateTextElement(element.id, { align: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>X: {element.x}px</Label>
                <Slider
                  value={[element.x]}
                  onValueChange={([v]) =>
                    updateTextElement(element.id, { x: v })
                  }
                  min={0}
                  max={canvasWidth}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Y: {element.y}px</Label>
                <Slider
                  value={[element.y]}
                  onValueChange={([v]) =>
                    updateTextElement(element.id, { y: v })
                  }
                  min={0}
                  max={canvasHeight}
                  step={1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Letter Spacing: {element.letterSpacing}px</Label>
              <Slider
                value={[element.letterSpacing]}
                onValueChange={([v]) =>
                  updateTextElement(element.id, { letterSpacing: v })
                }
                min={-5}
                max={20}
                step={0.5}
              />
            </div>

            <div className="space-y-2">
              <Label>Line Height: {element.lineHeight.toFixed(2)}</Label>
              <Slider
                value={[element.lineHeight]}
                onValueChange={([v]) =>
                  updateTextElement(element.id, { lineHeight: v })
                }
                min={0.8}
                max={2}
                step={0.05}
              />
            </div>
          </div>

          {index < textElements.length - 1 && <Separator />}
        </div>
      ))}

      {textElements.length === 0 && (
        <p className="text-center text-neutral-500 text-sm py-8">
          No text elements yet. Add one to get started.
        </p>
      )}
    </div>
  );
}
