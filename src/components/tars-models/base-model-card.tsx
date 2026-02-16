import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Plus, Image, Music, FileText, Video, FileCode } from 'lucide-react';
import type { BaseModel, BaseModelCategory } from '@/types/api';
import { cn } from '@/lib/utils';

interface BaseModelCardProps {
  baseModel: BaseModel;
  onSelect: (baseModel: BaseModel) => void;
}

const categoryIcons: Record<BaseModelCategory, React.ElementType> = {
  IMAGE: Image,
  AUDIO: Music,
  TEXT: FileText,
  VIDEO: Video,
  DOCUMENT: FileCode,
};

const categoryColors: Record<BaseModelCategory, string> = {
  IMAGE: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  AUDIO: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  TEXT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  VIDEO: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  DOCUMENT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export function BaseModelCard({ baseModel, onSelect }: BaseModelCardProps) {
  const CategoryIcon = categoryIcons[baseModel.category];

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', categoryColors[baseModel.category])}>
              <CategoryIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{baseModel.name}</CardTitle>
              <Badge variant="outline" className="mt-1 text-xs">
                {baseModel.outputType}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <CardDescription className="line-clamp-3">{baseModel.description}</CardDescription>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          ~{baseModel.estimatedSeconds}s
        </div>
        <Button size="sm" onClick={() => onSelect(baseModel)}>
          <Plus className="mr-1 h-4 w-4" />
          Create Model
        </Button>
      </CardFooter>
    </Card>
  );
}
