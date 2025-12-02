import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import Console from '@/components/Console';
import FileManager from '@/components/FileManager';
import ServerControl from '@/components/ServerControl';
import Settings from '@/components/Settings';
import Domains from '@/components/Domains';
import Profile from '@/components/Profile';

type MenuItem = {
  icon: string;
  label: string;
  id: string;
};

const menuItems: MenuItem[] = [
  { icon: 'Server', label: 'Серверы', id: 'servers' },
  { icon: 'Terminal', label: 'Консоль', id: 'console' },
  { icon: 'FolderOpen', label: 'Файлы', id: 'files' },
  { icon: 'Globe', label: 'Домены', id: 'domains' },
  { icon: 'Settings', label: 'Настройки', id: 'settings' },
  { icon: 'User', label: 'Профиль', id: 'profile' },
];

const Index = () => {
  const [activeSection, setActiveSection] = useState('servers');
  const [selectedServer, setSelectedServer] = useState({
    id: '1',
    name: 'Minecraft Server #1',
  });
  const [isServerRunning, setIsServerRunning] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'servers':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Серверы</h1>
              <p className="text-muted-foreground">Управление VPS серверами</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { id: '1', name: 'Minecraft Server #1', status: 'online', players: '12/20' },
                { id: '2', name: 'Minecraft Server #2', status: 'offline', players: '0/30' },
                { id: '3', name: 'Test Server', status: 'maintenance', players: '0/10' },
              ].map((server) => (
                <Card
                  key={server.id}
                  className="hover-scale cursor-pointer"
                  onClick={() => {
                    setSelectedServer({ id: server.id, name: server.name });
                    setActiveSection('console');
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{server.name}</CardTitle>
                      <Badge
                        variant={server.status === 'online' ? 'default' : 'secondary'}
                        className="gap-1.5"
                      >
                        <span
                          className={`h-2 w-2 rounded-full animate-pulse-glow ${
                            server.status === 'online'
                              ? 'bg-green-500'
                              : server.status === 'offline'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                          }`}
                        />
                        {server.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Игроки</span>
                        <span className="font-data font-semibold">{server.players}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">IP</span>
                        <span className="font-data">185.142.23.45</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Версия</span>
                        <span className="font-data">1.20.4</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="hover-scale cursor-pointer border-dashed flex items-center justify-center min-h-[200px]">
                <CardContent className="text-center">
                  <Icon name="Plus" size={48} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="font-semibold">Создать сервер</p>
                  <p className="text-sm text-muted-foreground">Добавить новый VPS</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'console':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{selectedServer.name}</h1>
                <p className="text-muted-foreground">Консоль и управление</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveSection('servers')}
                className="gap-2"
              >
                <Icon name="ArrowLeft" size={16} />
                Назад к списку
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Console
                  serverId={selectedServer.id}
                  serverName={selectedServer.name}
                  isRunning={isServerRunning}
                />
              </div>
              <div>
                <ServerControl
                  serverId={selectedServer.id}
                  serverName={selectedServer.name}
                  onStatusChange={setIsServerRunning}
                />
              </div>
            </div>
          </div>
        );

      case 'files':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Файловый менеджер</h1>
              <p className="text-muted-foreground">
                Управление файлами сервера {selectedServer.name}
              </p>
            </div>
            <FileManager serverId={selectedServer.id} />
          </div>
        );

      case 'domains':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Домены</h1>
              <p className="text-muted-foreground">Настройка доменов для Minecraft серверов</p>
            </div>
            <Domains />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Настройки</h1>
              <p className="text-muted-foreground">API ключи и SFTP доступ</p>
            </div>
            <Settings serverId={selectedServer.id} />
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Профиль</h1>
              <p className="text-muted-foreground">Личные данные и управление доступом</p>
            </div>
            <Profile />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-sidebar-border">
          <SidebarContent>
            <div className="px-6 py-4 border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Icon name="Zap" size={18} className="text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-sidebar-foreground">VPS Control</span>
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/60 px-6 py-2">
                Управление
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeSection === item.id}
                        onClick={() => setActiveSection(item.id)}
                        className="px-6 py-3 hover:bg-sidebar-accent transition-colors cursor-pointer"
                      >
                        <Icon name={item.icon as any} size={20} />
                        <span className="font-medium">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <div className="p-8 animate-fade-in">{renderContent()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
