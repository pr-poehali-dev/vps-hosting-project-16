import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CoOwner {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator';
  avatar?: string;
  addedAt: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [name, setName] = useState('Александр Иванов');
  const [email, setEmail] = useState('alex@example.com');
  const [showCoOwners, setShowCoOwners] = useState(false);
  const [coOwners, setCoOwners] = useState<CoOwner[]>([
    {
      id: '1',
      name: 'Мария Петрова',
      email: 'maria@example.com',
      role: 'admin',
      addedAt: '2 недели назад',
    },
    {
      id: '2',
      name: 'Иван Сидоров',
      email: 'ivan@example.com',
      role: 'moderator',
      addedAt: '1 месяц назад',
    },
  ]);
  const [newCoOwnerEmail, setNewCoOwnerEmail] = useState('');

  const handleSaveProfile = () => {
    toast({
      title: 'Профиль обновлен',
      description: 'Ваши данные успешно сохранены',
    });
  };

  const handleAddCoOwner = () => {
    if (!newCoOwnerEmail.trim()) return;

    const newCoOwner: CoOwner = {
      id: Date.now().toString(),
      name: newCoOwnerEmail.split('@')[0],
      email: newCoOwnerEmail,
      role: 'moderator',
      addedAt: 'только что',
    };

    setCoOwners([...coOwners, newCoOwner]);
    setNewCoOwnerEmail('');
    toast({
      title: 'Совладелец добавлен',
      description: `Приглашение отправлено на ${newCoOwnerEmail}`,
    });
  };

  const handleRemoveCoOwner = (id: string) => {
    setCoOwners(coOwners.filter(co => co.id !== id));
    toast({
      title: 'Совладелец удален',
      description: 'Доступ к серверу отозван',
    });
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="User" size={18} className="text-primary" />
              Личные данные
            </CardTitle>
            <CardDescription>Управление профилем и безопасностью</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>АИ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-lg">{name}</div>
                <div className="text-sm text-muted-foreground">{email}</div>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Icon name="Upload" size={14} />
                Изменить
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <Button onClick={handleSaveProfile} className="w-full gap-2">
              <Icon name="Save" size={16} />
              Сохранить изменения
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Users" size={18} className="text-primary" />
                  Тарифный план
                </CardTitle>
                <CardDescription className="mt-1.5">Ваша подписка и использование</CardDescription>
              </div>
              <Badge className="bg-primary">Premium</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Icon name="Server" size={16} className="text-muted-foreground" />
                  <span className="text-sm">Серверов</span>
                </div>
                <span className="font-data font-semibold">3 / 10</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Icon name="HardDrive" size={16} className="text-muted-foreground" />
                  <span className="text-sm">Дисковое пространство</span>
                </div>
                <span className="font-data font-semibold">45 / 100 GB</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Icon name="Zap" size={16} className="text-muted-foreground" />
                  <span className="text-sm">RAM</span>
                </div>
                <span className="font-data font-semibold">8 / 16 GB</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} className="text-muted-foreground" />
                  <span className="text-sm">Следующий платеж</span>
                </div>
                <span className="font-data font-semibold">15 дек 2024</span>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2">
              <Icon name="CreditCard" size={16} />
              Управление подпиской
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icon name="UserPlus" size={18} className="text-primary" />
                Совладельцы
              </CardTitle>
              <CardDescription className="mt-1.5">
                Предоставьте доступ к управлению сервером другим пользователям
              </CardDescription>
            </div>
            <Button onClick={() => setShowCoOwners(true)} className="gap-2">
              <Icon name="Plus" size={16} />
              Добавить
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {coOwners.map((coOwner) => (
              <div
                key={coOwner.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={coOwner.avatar} />
                    <AvatarFallback>
                      {coOwner.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{coOwner.name}</div>
                    <div className="text-sm text-muted-foreground">{coOwner.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={coOwner.role === 'admin' ? 'default' : 'secondary'}>
                    {coOwner.role === 'admin' ? 'Администратор' : 'Модератор'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{coOwner.addedAt}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCoOwner(coOwner.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ))}

            {coOwners.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Users" size={48} className="mx-auto mb-3 opacity-50" />
                <p>Совладельцы не добавлены</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCoOwners} onOpenChange={setShowCoOwners}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="UserPlus" size={18} />
              Добавить совладельца
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coowner-email">Email пользователя</Label>
              <Input
                id="coowner-email"
                type="email"
                placeholder="user@example.com"
                value={newCoOwnerEmail}
                onChange={(e) => setNewCoOwnerEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                На указанный email будет отправлено приглашение с доступом к серверу
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCoOwners(false)}>
                Отмена
              </Button>
              <Button onClick={handleAddCoOwner} className="gap-1.5">
                <Icon name="Send" size={16} />
                Отправить приглашение
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;
