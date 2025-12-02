import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface ConsoleLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'command';
  message: string;
}

interface ConsoleProps {
  serverId: string;
  serverName: string;
  isRunning: boolean;
}

const Console = ({ serverId, serverName, isRunning }: ConsoleProps) => {
  const [logs, setLogs] = useState<ConsoleLog[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: 'Система инициализирована',
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'success',
      message: `Подключение к серверу ${serverName} установлено`,
    },
  ]);
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const messages = [
          'Проверка соединения...',
          'CPU: 45% | RAM: 2.1GB/4GB',
          'Активных игроков: 12',
          'TPS: 19.8',
          'Автосохранение выполнено',
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        addLog('info', randomMessage);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const addLog = (type: ConsoleLog['type'], message: string) => {
    const newLog: ConsoleLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    addLog('command', `> ${command}`);
    setCommandHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);

    setTimeout(() => {
      if (command.toLowerCase() === 'help') {
        addLog('info', 'Доступные команды: help, clear, status, list, stop, restart, say <message>');
      } else if (command.toLowerCase() === 'clear') {
        setLogs([]);
      } else if (command.toLowerCase() === 'status') {
        addLog('success', `Сервер ${serverName} работает нормально | Uptime: 5h 23m`);
      } else if (command.toLowerCase() === 'list') {
        addLog('info', 'Игроки онлайн: Player1, Player2, Player3 (3/20)');
      } else if (command.toLowerCase().startsWith('say ')) {
        const message = command.substring(4);
        addLog('success', `[Сервер] ${message}`);
      } else {
        addLog('success', `Команда "${command}" выполнена успешно`);
      }
    }, 300);

    setCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        if (newIndex === commandHistory.length - 1 && historyIndex === newIndex) {
          setHistoryIndex(-1);
          setCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCommand(commandHistory[newIndex]);
        }
      }
    }
  };

  const getLogColor = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'info':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'command':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="h-full bg-black/50 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-data flex items-center gap-2">
            <Icon name="Terminal" size={18} className="text-primary" />
            Консоль сервера
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLogs([])}
              className="gap-1.5"
            >
              <Icon name="Trash2" size={14} />
              Очистить
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addLog('info', 'Экспорт логов...')}
              className="gap-1.5"
            >
              <Icon name="Download" size={14} />
              Экспорт
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ScrollArea className="h-[400px] rounded-lg bg-black/80 p-4 font-data text-sm" ref={scrollRef}>
          <div className="space-y-1">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 font-mono">
                <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                <span className={getLogColor(log.type)}>{log.message}</span>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleCommand} className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-data">
              $
            </span>
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите команду... (попробуйте 'help')"
              className="pl-8 font-data bg-black/50 border-border/50"
              disabled={!isRunning}
            />
          </div>
          <Button type="submit" disabled={!isRunning} className="gap-1.5">
            <Icon name="Send" size={16} />
            Выполнить
          </Button>
        </form>

        {!isRunning && (
          <div className="text-center text-sm text-yellow-500 py-2">
            Сервер остановлен. Запустите сервер для использования консоли.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Console;
