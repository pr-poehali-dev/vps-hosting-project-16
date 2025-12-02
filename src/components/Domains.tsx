import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Domain {
  id: string;
  domain: string;
  status: 'active' | 'pending' | 'error';
  type: 'A' | 'SRV';
  ip: string;
  port: number;
}

const Domains = () => {
  const { toast } = useToast();
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      domain: 'play.myserver.com',
      status: 'active',
      type: 'A',
      ip: '185.142.23.45',
      port: 25565,
    },
    {
      id: '2',
      domain: 'mc.myserver.com',
      status: 'active',
      type: 'SRV',
      ip: '185.142.23.45',
      port: 25566,
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;

    const domain: Domain = {
      id: Date.now().toString(),
      domain: newDomain,
      status: 'pending',
      type: 'A',
      ip: '185.142.23.45',
      port: 25565,
    };

    setDomains([...domains, domain]);
    setIsAdding(false);
    setNewDomain('');

    setTimeout(() => {
      setDomains(prev => prev.map(d => 
        d.id === domain.id ? { ...d, status: 'active' as const } : d
      ));
      toast({
        title: 'Домен подключен',
        description: `${newDomain} готов к использованию`,
      });
    }, 3000);
  };

  const handleDeleteDomain = (id: string) => {
    setDomains(domains.filter(d => d.id !== id));
    toast({
      title: 'Домен удален',
      description: 'DNS записи будут удалены в течение 24 часов',
    });
  };

  const getStatusColor = (status: Domain['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
    }
  };

  const getStatusText = (status: Domain['status']) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'pending':
        return 'Настройка...';
      case 'error':
        return 'Ошибка';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Globe" size={18} className="text-primary" />
                Домены для Minecraft
              </CardTitle>
              <CardDescription className="mt-1.5">
                Подключите свой домен для удобного доступа к серверу
              </CardDescription>
            </div>
            <Button onClick={() => setIsAdding(true)} className="gap-2">
              <Icon name="Plus" size={16} />
              Добавить домен
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {domains.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Globe" size={48} className="mx-auto mb-3 opacity-50" />
              <p>Домены не настроены</p>
              <p className="text-sm mt-1">Добавьте домен для подключения к серверу</p>
            </div>
          ) : (
            <div className="space-y-3">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-lg font-data">{domain.domain}</span>
                        <Badge variant="secondary" className="gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${getStatusColor(domain.status)} animate-pulse-glow`} />
                          {getStatusText(domain.status)}
                        </Badge>
                        <Badge variant="outline">{domain.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" size={14} />
                          IP: <span className="font-mono">{domain.ip}:{domain.port}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDomain(domain.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>

                  {domain.status === 'active' && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="CheckCircle2" size={14} className="text-green-500" />
                        <span className="text-muted-foreground">
                          Игроки могут подключаться через: <span className="font-mono font-semibold">{domain.domain}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {domain.status === 'pending' && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-yellow-500">
                        <Icon name="Clock" size={14} />
                        <span>DNS записи обновляются... Это может занять до 5 минут</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={18} className="text-primary mt-0.5 shrink-0" />
              <div className="text-sm space-y-2">
                <p className="font-medium">Настройка DNS для вашего домена:</p>
                <div className="space-y-1 text-muted-foreground">
                  <p><strong>A запись:</strong> Укажите IP: 185.142.23.45</p>
                  <p><strong>SRV запись:</strong> _minecraft._tcp.{'{'}домен{'}'} → IP:PORT</p>
                  <p className="text-xs mt-2">После настройки DNS, домен автоматически активируется</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Globe" size={18} />
              Добавить домен
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Доменное имя</Label>
              <Input
                id="domain"
                placeholder="play.example.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Введите поддомен, который будет указывать на ваш Minecraft сервер
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Отмена
              </Button>
              <Button onClick={handleAddDomain} className="gap-1.5">
                <Icon name="Plus" size={16} />
                Добавить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Domains;
