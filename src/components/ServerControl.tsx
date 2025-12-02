import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

interface ServerControlProps {
  serverId: string;
  serverName: string;
  onStatusChange: (isRunning: boolean) => void;
}

const ServerControl = ({ serverId, serverName, onStatusChange }: ServerControlProps) => {
  const [status, setStatus] = useState<'online' | 'offline' | 'starting' | 'stopping'>('offline');
  const [uptime, setUptime] = useState('0h 0m');
  const [players, setPlayers] = useState({ online: 0, max: 20 });

  const handleStart = () => {
    setStatus('starting');
    setTimeout(() => {
      setStatus('online');
      setUptime('0h 1m');
      setPlayers({ online: 3, max: 20 });
      onStatusChange(true);
    }, 3000);
  };

  const handleStop = () => {
    setStatus('stopping');
    setTimeout(() => {
      setStatus('offline');
      setUptime('0h 0m');
      setPlayers({ online: 0, max: 20 });
      onStatusChange(false);
    }, 2000);
  };

  const handleRestart = () => {
    setStatus('stopping');
    setTimeout(() => {
      setStatus('starting');
      setTimeout(() => {
        setStatus('online');
        onStatusChange(true);
      }, 3000);
    }, 2000);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'starting':
      case 'stopping':
        return 'bg-yellow-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Запущен';
      case 'offline':
        return 'Остановлен';
      case 'starting':
        return 'Запускается...';
      case 'stopping':
        return 'Останавливается...';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Icon name="Power" size={20} className="text-primary" />
            Управление сервером
          </span>
          <Badge variant="secondary" className="gap-1.5">
            <span className={`h-2 w-2 rounded-full ${getStatusColor()} animate-pulse-glow`} />
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={handleStart}
            disabled={status === 'online' || status === 'starting' || status === 'stopping'}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Icon name="Play" size={18} />
            Запустить
          </Button>
          <Button
            onClick={handleRestart}
            disabled={status !== 'online'}
            variant="outline"
            className="gap-2"
          >
            <Icon name="RefreshCw" size={18} />
            Перезапуск
          </Button>
          <Button
            onClick={handleStop}
            disabled={status === 'offline' || status === 'starting' || status === 'stopping'}
            variant="destructive"
            className="gap-2"
          >
            <Icon name="Square" size={18} />
            Остановить
          </Button>
        </div>

        {(status === 'starting' || status === 'stopping') && (
          <div className="space-y-2">
            <Progress value={66} className="animate-pulse" />
            <p className="text-sm text-center text-muted-foreground">
              {status === 'starting' ? 'Загрузка сервера...' : 'Сохранение и остановка...'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Uptime</span>
            </div>
            <div className="text-2xl font-bold font-data">{uptime}</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Users" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Игроки</span>
            </div>
            <div className="text-2xl font-bold font-data">
              {players.online}/{players.max}
            </div>
          </div>
        </div>

        <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Версия</span>
            <span className="font-data">1.20.4</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Порт</span>
            <span className="font-data">25565</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">TPS</span>
            <span className="font-data text-green-500">19.8</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerControl;
