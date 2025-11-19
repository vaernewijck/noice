import { SketchParams } from '../App';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';

interface ControlsProps {
  params: SketchParams;
  setParams: (params: SketchParams) => void;
}

export function Controls({ params, setParams }: ControlsProps) {
  const updateParam = <K extends keyof SketchParams>(
    key: K,
    value: SketchParams[K]
  ) => {
    setParams({ ...params, [key]: value });
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...params.colors];
    newColors[index] = color;
    setParams({ ...params, colors: newColors });
  };

  const updateThreshold = (index: number, value: number) => {
    const newThresholds = [...params.thresholds];
    newThresholds[index] = value;
    setParams({ ...params, thresholds: newThresholds });
  };

  return (
    <div className="space-y-6">
      {/* Canvas Settings */}
      <div className="space-y-4">
        <h3 className="text-neutral-700">Canvas</h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Width: {params.canvasWidth}px</Label>
            <Slider
              value={[params.canvasWidth]}
              onValueChange={([v]) => updateParam('canvasWidth', v)}
              min={200}
              max={800}
              step={10}
            />
          </div>
          <div className="space-y-2">
            <Label>Height: {params.canvasHeight}px</Label>
            <Slider
              value={[params.canvasHeight]}
              onValueChange={([v]) => updateParam('canvasHeight', v)}
              min={200}
              max={1200}
              step={10}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Grid Settings */}
      <div className="space-y-4">
        <h3 className="text-neutral-700">Grid</h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Cells: {params.nCells}</Label>
            <Slider
              value={[params.nCells]}
              onValueChange={([v]) => updateParam('nCells', v)}
              min={50}
              max={300}
              step={10}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Animation Settings */}
      <div className="space-y-4">
        <h3 className="text-neutral-700">Animation</h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Frame Rate: {params.frameRate} fps</Label>
            <Slider
              value={[params.frameRate]}
              onValueChange={([v]) => updateParam('frameRate', v)}
              min={1}
              max={60}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Pixel Density: {params.pixelDensity.toFixed(2)}</Label>
            <Slider
              value={[params.pixelDensity]}
              onValueChange={([v]) => updateParam('pixelDensity', v)}
              min={0.1}
              max={2}
              step={0.1}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Noise Settings */}
      <div className="space-y-4">
        <h3 className="text-neutral-700">Noise</h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Scale X: {params.noiseScaleX.toFixed(3)}</Label>
            <Slider
              value={[params.noiseScaleX]}
              onValueChange={([v]) => updateParam('noiseScaleX', v)}
              min={0.001}
              max={0.1}
              step={0.001}
            />
          </div>
          <div className="space-y-2">
            <Label>Scale Y: {params.noiseScaleY.toFixed(3)}</Label>
            <Slider
              value={[params.noiseScaleY]}
              onValueChange={([v]) => updateParam('noiseScaleY', v)}
              min={0.001}
              max={0.1}
              step={0.001}
            />
          </div>
          <div className="space-y-2">
            <Label>Time Speed: {params.noiseScaleTime.toFixed(3)}</Label>
            <Slider
              value={[params.noiseScaleTime]}
              onValueChange={([v]) => updateParam('noiseScaleTime', v)}
              min={0}
              max={0.1}
              step={0.001}
            />
          </div>
          <div className="space-y-2">
            <Label>Power: {params.noisePower.toFixed(2)}</Label>
            <Slider
              value={[params.noisePower]}
              onValueChange={([v]) => updateParam('noisePower', v)}
              min={0.5}
              max={4}
              step={0.1}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Effects */}
      <div className="space-y-4">
        <h3 className="text-neutral-700">Effects</h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Grain: {params.grainStrength.toFixed(2)}</Label>
            <Slider
              value={[params.grainStrength]}
              onValueChange={([v]) => updateParam('grainStrength', v)}
              min={0}
              max={0.5}
              step={0.01}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label>Cell Stroke</Label>
            <Switch
              checked={params.showStroke}
              onCheckedChange={(checked) => updateParam('showStroke', checked)}
            />
          </div>

          {params.showStroke && (
            <>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={params.strokeColor}
                  onChange={(e) => updateParam('strokeColor', e.target.value)}
                  className="w-16 h-9 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={params.strokeColor}
                  onChange={(e) => updateParam('strokeColor', e.target.value)}
                  className="flex-1 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Stroke Width: {params.strokeWidth.toFixed(1)}px</Label>
                <Slider
                  value={[params.strokeWidth]}
                  onValueChange={([v]) => updateParam('strokeWidth', v)}
                  min={0.5}
                  max={5}
                  step={0.5}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-neutral-700">Colors</h3>
        <div className="space-y-3">
          {params.colors.map((color, index) => (
            <div key={index} className="flex items-center gap-3">
              <Input
                type="color"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="w-16 h-9 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="flex-1 text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Thresholds */}
      <div className="space-y-4">
        <h3 className="text-neutral-700">Thresholds</h3>
        <div className="space-y-3">
          {params.thresholds.map((threshold, index) => (
            <div key={index} className="space-y-2">
              <Label>Level {index + 1}: {threshold.toFixed(2)}</Label>
              <Slider
                value={[threshold]}
                onValueChange={([v]) => updateThreshold(index, v)}
                min={0}
                max={6}
                step={0.05}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}