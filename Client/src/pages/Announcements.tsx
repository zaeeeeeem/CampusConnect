import { useEffect, useState } from 'react';
import { Card, Badge, Avatar, Button } from '../components/ui';
import { Announcement } from '../types';
import { api } from '../api/api';

export const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      const response = await api.announcements.getAll();
      if (response.success) {
        setAnnouncements(response.data);
      }
      setLoading(false);
    };
    fetchAnnouncements();
  }, []);

  const categories = ['all', 'academic', 'event', 'administrative', 'club', 'general'];

  const filteredAnnouncements = filter === 'all'
    ? announcements
    : announcements.filter(a => a.category === filter);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
      academic: 'primary',
      event: 'success',
      administrative: 'warning',
      club: 'info',
      general: 'primary',
    };
    return colors[category] || 'primary';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading announcements...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        <Button>Create Announcement</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
          <Button
            key={category}
            variant={filter === category ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAnnouncements.map(announcement => (
          <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <Avatar alt={announcement.author.name} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {announcement.title}
                    </h3>
                    {announcement.isPinned && (
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3.5L6.5 7h-3v2h1l1 9h7l1-9h1V7h-3L10 3.5z" />
                      </svg>
                    )}
                  </div>
                  <Badge variant={getCategoryColor(announcement.category)}>
                    {announcement.category}
                  </Badge>
                </div>

                <div className="mt-1 text-sm text-gray-600">
                  {announcement.author.name} • {formatDate(announcement.createdAt)}
                </div>

                <p className="mt-3 text-gray-700 whitespace-pre-line">
                  {announcement.content}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {announcement.tags.map(tag => (
                    <Badge key={tag} variant="info" size="sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
