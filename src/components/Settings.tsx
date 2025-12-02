import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SettingsProps {
  serverId: string;
}

const Settings = ({ serverId }: SettingsProps) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('sk_live_51Hx...********************');
  const [sftpEnabled, setSftpEnabled] = useState(true);
  const [sftpPort, setSftpPort] = useState('22');
  const [sftpPassword, setSftpPassword] = useState('**********');

  const handleGenerateApiKey = () => {
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
    toast({
      title: 'API ключ создан',
      description: 'Новый ключ скопирован в буфер обмена',
    });
  };

  const handleSaveSftp = () => {
    toast({
      title: 'Настройки SFTP сохранены',
      description: 'Изменения вступят в силу через несколько секунд',
    });
  };

  return (
    <Tabs defaultValue="api" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="api" className="gap-2">
          <Icon name="Code2" size={16} />
          API
        </TabsTrigger>
        <TabsTrigger value="sftp" className="gap-2">
          <Icon name="Terminal" size={16} />
          SFTP
        </TabsTrigger>
      </TabsList>

      <TabsContent value="api" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Key" size={18} className="text-primary" />
              API Ключи
            </CardTitle>
            <CardDescription>
              Используйте API ключи для интеграции с внешними сервисами
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Основной API ключ</Label>
              <div className="flex gap-2">
                <Input
                  id="api-key"
                  value={apiKey}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(apiKey);
                    toast({ title: 'Скопировано!' });
                  }}
                  className="gap-1.5"
                >
                  <Icon name="Copy" size={16} />
                </Button>
              </div>
            </div>

            <Button onClick={handleGenerateApiKey} variant="outline" className="gap-2 w-full">
              <Icon name="RefreshCw" size={16} />
              Создать новый ключ
            </Button>

            <div className="p-4 rounded-lg bg-muted/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Rate Limit</div>
                  <div className="text-sm text-muted-foreground">1000 запросов/час</div>
                </div>
                <Badge variant="secondary">Активно</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Webhooks</div>
                  <div className="text-sm text-muted-foreground">Уведомления о событиях</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="BookOpen" size={16} className="text-primary" />
                <span className="font-semibold">Документация API</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><code className="bg-muted px-2 py-0.5 rounded">GET /api/v1/servers</code> - Список серверов</p>
                <p><code className="bg-muted px-2 py-0.5 rounded">POST /api/v1/servers/:id/start</code> - Запуск</p>
                <p><code className="bg-muted px-2 py-0.5 rounded">POST /api/v1/servers/:id/stop</code> - Остановка</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sftp" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="HardDrive" size={18} className="text-primary" />
              SFTP Доступ
            </CardTitle>
            <CardDescription>
              Настройте безопасный доступ к файлам сервера через SFTP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <div className="font-medium">SFTP сервер</div>
                <div className="text-sm text-muted-foreground">Разрешить SFTP подключения</div>
              </div>
              <Switch
                checked={sftpEnabled}
                onCheckedChange={setSftpEnabled}
              />
            </div>

            {sftpEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="sftp-host">Хост</Label>
                  <Input
                    id="sftp-host"
                    value="sftp.server.example.com"
                    readOnly
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sftp-port">Порт</Label>
                  <Input
                    id="sftp-port"
                    value={sftpPort}
                    onChange={(e) => setSftpPort(e.target.value)}
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sftp-username">Имя пользователя</Label>
                  <Input
                    id="sftp-username"
                    value={`server_${serverId}`}
                    readOnly
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sftp-password">Пароль</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sftp-password"
                      type="password"
                      value={sftpPassword}
                      onChange={(e) => setSftpPassword(e.target.value)}
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setSftpPassword(Math.random().toString(36).substring(2, 15))}
                      className="gap-1.5"
                    >
                      <Icon name="RefreshCw" size={16} />
                    </Button>
                  </div>
                </div>

                <Button onClick={handleSaveSftp} className="w-full gap-2">
                  <Icon name="Save" size={16} />
                  Сохранить настройки SFTP
                </Button>

                <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                  <div className="flex items-start gap-3">
                    <Icon name="Info" size={18} className="text-primary mt-0.5" />
                    <div className="text-sm space-y-1">
                      <p className="font-medium">Подключение через FileZilla:</p>
                      <p className="text-muted-foreground">
                        1. Выберите SFTP протокол<br />
                        2. Введите данные выше<br />
                        3. Нажмите "Быстрое соединение"
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Settings;
