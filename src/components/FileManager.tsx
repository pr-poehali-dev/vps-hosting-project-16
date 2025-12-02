import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  content?: string;
}

interface FileManagerProps {
  serverId: string;
}

const mockFiles: FileItem[] = [
  { id: '1', name: 'server.properties', type: 'file', size: '2.4 KB', modified: '2 часа назад', content: 'server-port=25565\nmax-players=20\ndifficulty=normal' },
  { id: '2', name: 'plugins', type: 'folder', modified: '1 день назад' },
  { id: '3', name: 'world', type: 'folder', modified: '3 часа назад' },
  { id: '4', name: 'whitelist.json', type: 'file', size: '156 B', modified: '5 часов назад', content: '[]' },
  { id: '5', name: 'logs', type: 'folder', modified: '1 час назад' },
  { id: '6', name: 'config.yml', type: 'file', size: '1.8 KB', modified: '2 дня назад', content: 'version: 1.0\nport: 25565' },
];

const FileManager = ({ serverId }: FileManagerProps) => {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      setEditContent(file.content || '');
      setIsEditing(true);
    } else {
      setCurrentPath(currentPath + file.name + '/');
    }
  };

  const handleSaveFile = () => {
    if (selectedFile) {
      setFiles(files.map(f => 
        f.id === selectedFile.id 
          ? { ...f, content: editContent, modified: 'только что' }
          : f
      ));
      setIsEditing(false);
      setSelectedFile(null);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const handleUploadFile = () => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: `newfile_${Date.now()}.txt`,
      type: 'file',
      size: '0 B',
      modified: 'только что',
      content: '',
    };
    setFiles([...files, newFile]);
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="FolderOpen" size={18} className="text-primary" />
              Файловый менеджер
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUploadFile}
                className="gap-1.5"
              >
                <Icon name="Upload" size={14} />
                Загрузить
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
              >
                <Icon name="FolderPlus" size={14} />
                Новая папка
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск файлов..."
                className="pl-9"
              />
            </div>
            <Badge variant="secondary" className="font-data">
              {currentPath}
            </Badge>
          </div>

          <ScrollArea className="h-[450px] rounded-lg border border-border">
            <div className="p-2 space-y-1">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group"
                >
                  <button
                    onClick={() => handleFileClick(file)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      file.type === 'folder' ? 'bg-blue-500/10' : 'bg-purple-500/10'
                    }`}>
                      <Icon
                        name={file.type === 'folder' ? 'Folder' : 'FileText'}
                        size={20}
                        className={file.type === 'folder' ? 'text-blue-500' : 'text-purple-500'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {file.size && `${file.size} • `}{file.modified}
                      </div>
                    </div>
                  </button>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {file.type === 'file' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedFile(file);
                            setEditContent(file.content || '');
                            setIsEditing(true);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Icon name="Edit" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Icon name="Download" size={14} />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFile(file.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredFiles.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="FolderOpen" size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Файлы не найдены</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
            <span>{filteredFiles.length} файлов и папок</span>
            <span>SFTP: sftp://server.example.com:22</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="FileText" size={18} />
              {selectedFile?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="font-mono text-sm min-h-[400px]"
              placeholder="Содержимое файла..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Отмена
              </Button>
              <Button onClick={handleSaveFile} className="gap-1.5">
                <Icon name="Save" size={16} />
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileManager;
