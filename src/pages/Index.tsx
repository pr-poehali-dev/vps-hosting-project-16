import { useState, useEffect } from 'react';
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

interface ServerMetric {
  cpu: number;
  ram: number;
  network: number;
  disk: number;
}

interface Server {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  location: string;
  ip: string;
  metrics: ServerMetric;
}

const menuItems = [
  { icon: 'Server', label: 'Серверы', active: true },
  { icon: 'Activity', label: 'Мониторинг', active: false },
  { icon: 'Code2', label: 'API', active: false },
  { icon: 'Shield', label: 'Безопасность', active: false },
  { icon: 'CreditCard', label: 'Биллинг', active: false },
  { icon: 'Globe', label: 'Домены', active: false },
  { icon: 'MessageSquare', label: 'Поддержка', active: false },
  { icon: 'User', label: 'Профиль', active: false },
];

const mockServers: Server[] = [
  {
    id: '1',
    name: 'Web Server 01',
    status: 'online',
    location: 'Frankfurt',
    ip: '185.142.23.45',
    metrics: { cpu: 45, ram: 62, network: 38, disk: 55 },
  },
  {
    id: '2',
    name: 'DB Server 01',
    status: 'online',
    location: 'Amsterdam',
    ip: '195.201.87.112',
    metrics: { cpu: 72, ram: 81, network: 52, disk: 68 },
  },
  {
    id: '3',
    name: 'App Server 02',
    status: 'maintenance',
    location: 'London',
    ip: '46.101.45.23',
    metrics: { cpu: 12, ram: 28, network: 5, disk: 33 },
  },
];

const Index = () => {
  const [servers, setServers] = useState<Server[]>(mockServers);
  const [activeMetric, setActiveMetric] = useState<'cpu' | 'ram' | 'network' | 'disk'>('cpu');

  useEffect(() => {
    const interval = setInterval(() => {
      setServers(prevServers =>
        prevServers.map(server => ({
          ...server,
          metrics: {
            cpu: Math.max(10, Math.min(95, server.metrics.cpu + (Math.random() - 0.5) * 10)),
            ram: Math.max(10, Math.min(95, server.metrics.ram + (Math.random() - 0.5) * 8)),
            network: Math.max(5, Math.min(100, server.metrics.network + (Math.random() - 0.5) * 15)),
            disk: Math.max(10, Math.min(95, server.metrics.disk + (Math.random() - 0.5) * 5)),
          },
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Server['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-red-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const totalMetrics = {
    cpu: Math.round(servers.reduce((acc, s) => acc + s.metrics.cpu, 0) / servers.length),
    ram: Math.round(servers.reduce((acc, s) => acc + s.metrics.ram, 0) / servers.length),
    network: Math.round(servers.reduce((acc, s) => acc + s.metrics.network, 0) / servers.length),
    disk: Math.round(servers.reduce((acc, s) => acc + s.metrics.disk, 0) / servers.length),
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
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        isActive={item.active}
                        className="px-6 py-3 hover:bg-sidebar-accent transition-colors"
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
          <div className="p-8 animate-fade-in">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Мониторинг ресурсов в реальном времени
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'CPU', value: totalMetrics.cpu, icon: 'Cpu', color: 'primary' },
                { label: 'RAM', value: totalMetrics.ram, icon: 'MemoryStick', color: 'secondary' },
                { label: 'Network', value: totalMetrics.network, icon: 'Network', color: 'accent' },
                { label: 'Disk', value: totalMetrics.disk, icon: 'HardDrive', color: 'chart-4' },
              ].map((metric) => (
                <Card
                  key={metric.label}
                  className="hover-scale cursor-pointer transition-all"
                  onClick={() => setActiveMetric(metric.label.toLowerCase() as any)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {metric.label}
                      </CardTitle>
                      <Icon
                        name={metric.icon as any}
                        size={18}
                        className={`text-${metric.color}`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-bold font-data ${getMetricColor(metric.value)}`}>
                        {metric.value}
                      </span>
                      <span className="text-muted-foreground">%</span>
                    </div>
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${metric.color} transition-all duration-500 animate-pulse-glow`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Серверы</CardTitle>
                  <Button className="gap-2">
                    <Icon name="Plus" size={18} />
                    Добавить сервер
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servers.map((server) => (
                    <div
                      key={server.id}
                      className="p-6 border border-border rounded-lg hover-scale transition-all bg-card"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            <Icon name="Server" size={24} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{server.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Icon name="MapPin" size={14} />
                                {server.location}
                              </div>
                              <div className="flex items-center gap-1.5 font-data">
                                <Icon name="Globe" size={14} />
                                {server.ip}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={server.status === 'online' ? 'default' : 'secondary'}
                            className="gap-1.5"
                          >
                            <span className={`h-2 w-2 rounded-full ${getStatusColor(server.status)} animate-pulse-glow`} />
                            {server.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'CPU', value: server.metrics.cpu, icon: 'Cpu' },
                          { label: 'RAM', value: server.metrics.ram, icon: 'MemoryStick' },
                          { label: 'Network', value: server.metrics.network, icon: 'Network' },
                          { label: 'Disk', value: server.metrics.disk, icon: 'HardDrive' },
                        ].map((metric) => (
                          <div key={metric.label} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-1.5">
                                <Icon name={metric.icon as any} size={14} />
                                {metric.label}
                              </span>
                              <span className={`font-data font-semibold ${getMetricColor(metric.value)}`}>
                                {Math.round(metric.value)}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  metric.value >= 80
                                    ? 'bg-red-500'
                                    : metric.value >= 60
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${metric.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
