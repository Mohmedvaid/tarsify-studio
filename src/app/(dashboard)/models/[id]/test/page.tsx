'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Loader2, Clock, AlertCircle, CheckCircle2, Image as ImageIcon, FileText, Video, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';
import { ErrorMessage } from '@/components/shared';
import { TarsModelStatusBadge } from '@/components/tars-models';
import { useTarsModel, useTestRunModel } from '@/hooks';
import type { InputSchema, InputSchemaProperty, TestRunResult, OutputType } from '@/types/api';

interface TestModelPageProps {
  params: Promise<{ id: string }>;
}

// Dynamic form field renderer based on input schema property
function DynamicField({
  name,
  property,
  value,
  onChange,
  disabled,
}: {
  name: string;
  property: InputSchemaProperty;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
  disabled?: boolean;
}) {
  const label = property.title || name;
  const isRequired = false; // We'll handle required from the parent

  switch (property.type) {
    case 'string':
      // Use textarea for longer text fields like prompts
      if (name.toLowerCase().includes('prompt') || (property.maxLength && property.maxLength > 200)) {
        return (
          <div className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={name}
              placeholder={property.description || `Enter ${label}`}
              value={(value as string) || property.default as string || ''}
              onChange={(e) => onChange(name, e.target.value)}
              disabled={disabled}
              rows={4}
            />
            {property.description && (
              <p className="text-xs text-muted-foreground">{property.description}</p>
            )}
          </div>
        );
      }
      return (
        <div className="space-y-2">
          <Label htmlFor={name}>
            {label}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id={name}
            type="text"
            placeholder={property.description || `Enter ${label}`}
            value={(value as string) || property.default as string || ''}
            onChange={(e) => onChange(name, e.target.value)}
            disabled={disabled}
          />
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      );

    case 'integer':
    case 'number':
      return (
        <div className="space-y-2">
          <Label htmlFor={name}>
            {label}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id={name}
            type="number"
            min={property.minimum}
            max={property.maximum}
            step={property.type === 'integer' ? 1 : 0.01}
            placeholder={property.description || `Enter ${label}`}
            value={value !== undefined ? String(value) : (property.default !== undefined ? String(property.default) : '')}
            onChange={(e) => onChange(name, property.type === 'integer' ? parseInt(e.target.value) || 0 : parseFloat(e.target.value) || 0)}
            disabled={disabled}
          />
          {(property.minimum !== undefined || property.maximum !== undefined) && (
            <p className="text-xs text-muted-foreground">
              {property.minimum !== undefined && property.maximum !== undefined
                ? `Range: ${property.minimum} - ${property.maximum}`
                : property.minimum !== undefined
                ? `Minimum: ${property.minimum}`
                : `Maximum: ${property.maximum}`}
            </p>
          )}
          {property.description && (
            <p className="text-xs text-muted-foreground">{property.description}</p>
          )}
        </div>
      );

    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <input
            id={name}
            type="checkbox"
            checked={value !== undefined ? Boolean(value) : Boolean(property.default)}
            onChange={(e) => onChange(name, e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor={name}>{label}</Label>
          {property.description && (
            <span className="text-xs text-muted-foreground ml-2">{property.description}</span>
          )}
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            type="text"
            placeholder={property.description || `Enter ${label}`}
            value={String(value || property.default || '')}
            onChange={(e) => onChange(name, e.target.value)}
            disabled={disabled}
          />
        </div>
      );
  }
}

// Output renderer based on output type
function OutputDisplay({ result, outputType }: { result: TestRunResult; outputType: OutputType }) {
  if (result.status === 'FAILED' || result.error) {
    return (
      <Card className="border-destructive">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            Test Run Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-destructive/10 p-4 rounded-md overflow-auto whitespace-pre-wrap text-destructive">
            {result.error || 'Unknown error occurred'}
          </pre>
        </CardContent>
      </Card>
    );
  }

  if (result.status === 'IN_PROGRESS' || result.status === 'IN_QUEUE') {
    return (
      <Card>
        <CardContent className="py-6 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </CardContent>
      </Card>
    );
  }

  const output = result.output;
  if (!output) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground">
          No output received
        </CardContent>
      </Card>
    );
  }

  // Get the image URL or other output
  const imageUrl = (output.image_url || output.imageUrl || output.url || output.image) as string | undefined;
  const textOutput = output.text || output.result || output.content;
  const videoUrl = (output.video_url || output.videoUrl || output.video) as string | undefined;
  const audioUrl = (output.audio_url || output.audioUrl || output.audio) as string | undefined;

  return (
    <Card className="border-green-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          Test Run Completed
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          Execution time: {(result.executionTimeMs / 1000).toFixed(2)}s
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Render based on output type */}
        {outputType === 'IMAGE' && imageUrl ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              Generated Image
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Generated output"
              className="max-w-full h-auto rounded-lg border"
            />
          </div>
        ) : null}

        {outputType === 'TEXT' && textOutput ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              Generated Text
            </div>
            <pre className="text-sm bg-muted p-4 rounded-md overflow-auto whitespace-pre-wrap">
              {typeof textOutput === 'string' ? textOutput : JSON.stringify(textOutput, null, 2)}
            </pre>
          </div>
        ) : null}

        {outputType === 'VIDEO' && videoUrl ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Video className="h-4 w-4" />
              Generated Video
            </div>
            <video
              src={videoUrl}
              controls
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        ) : null}

        {outputType === 'AUDIO' && audioUrl ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Volume2 className="h-4 w-4" />
              Generated Audio
            </div>
            <audio src={audioUrl} controls className="w-full" />
          </div>
        ) : null}

        {/* Raw JSON output for other types or as fallback */}
        {(outputType === 'JSON' || (!imageUrl && !textOutput && !videoUrl && !audioUrl)) ? (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Raw Output</div>
            <pre className="text-sm bg-muted p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(output, null, 2)}
            </pre>
          </div>
        ) : null}

        {/* Show additional metadata if available */}
        {output.seed !== undefined && (
          <div className="text-xs text-muted-foreground">
            Seed: {String(output.seed)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function TestModelPage({ params }: TestModelPageProps) {
  const { id } = use(params);
  const { data: model, isLoading, error } = useTarsModel(id);
  const testRun = useTestRunModel();
  
  const [inputs, setInputs] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<TestRunResult | null>(null);

  const handleInputChange = (name: string, value: unknown) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestRun = async () => {
    // Reset previous result
    setResult(null);
    
    try {
      const response = await testRun.mutateAsync({ id, inputs });
      setResult(response);
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !model) {
    return (
      <ErrorMessage
        title="Model not found"
        message="We couldn't find this model. It may have been deleted."
      />
    );
  }

  // Check if model can be tested
  const canTest = model.status !== 'ARCHIVED';
  const inputSchema: InputSchema | undefined = model.baseModel?.inputSchema as InputSchema | undefined;
  const outputType = model.baseModel?.outputType || 'JSON';
  const requiredFields = inputSchema?.required || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/models/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <PageHeader
            title={`Test: ${model.title}`}
            description="Run a test to validate your model before publishing"
          />
        </div>
        <TarsModelStatusBadge status={model.status} />
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">About Test Runs</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>• Test runs validate your model configuration before publishing</p>
          <p>• No credits are deducted for test runs</p>
          <p>• Timeout is approximately 30 seconds</p>
        </CardContent>
      </Card>

      {!canTest && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="py-4 text-sm text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="inline mr-2 h-4 w-4" />
            Archived models cannot be tested. Please restore the model first.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Test Inputs</CardTitle>
            <CardDescription>
              Configure the inputs for your test run based on {model.baseModel?.name || 'the base model'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {inputSchema?.properties ? (
              Object.entries(inputSchema.properties).map(([name, property]) => (
                <div key={name}>
                  {requiredFields.includes(name) && (
                    <Badge variant="outline" className="mb-1 text-xs">Required</Badge>
                  )}
                  <DynamicField
                    name={name}
                    property={property}
                    value={inputs[name]}
                    onChange={handleInputChange}
                    disabled={!canTest || testRun.isPending}
                  />
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                No input schema available. You can still enter inputs manually:
                <Textarea
                  className="mt-2"
                  placeholder='{"prompt": "Your prompt here"}'
                  rows={6}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setInputs(parsed);
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                />
              </div>
            )}

            <div className="pt-4 border-t">
              <Button
                onClick={handleTestRun}
                disabled={!canTest || testRun.isPending}
                className="w-full"
              >
                {testRun.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Test...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Test
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="space-y-4">
          <h3 className="font-semibold">Results</h3>
          
          {testRun.isPending && (
            <Card>
              <CardContent className="py-8 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Executing test run...</p>
                <p className="text-xs text-muted-foreground">This may take up to 30 seconds</p>
              </CardContent>
            </Card>
          )}

          {testRun.isError && !result && (
            <Card className="border-destructive">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Test Run Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive">
                  {testRun.error?.message || 'An unexpected error occurred'}
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <OutputDisplay result={result} outputType={outputType} />
          )}

          {!testRun.isPending && !testRun.isError && !result && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Run a test to see results here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
