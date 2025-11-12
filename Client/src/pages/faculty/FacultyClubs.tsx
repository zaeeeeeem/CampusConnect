import { useState, useEffect } from 'react';
import { clubService } from '../../api/services';
import { Club } from '../../types';
import { ClubCard, LoadingSpinner, EmptyState } from '../../components/shared';

export const FacultyClubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadClubs();
  }, []);

  useEffect(() => {
    filterClubs();
  }, [searchTerm, selectedCategory, clubs]);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const response = await clubService.getAll();
      if (response.success) {
        setClubs(response.data);
      }
    } catch (error) {
      console.error('Failed to load clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterClubs = () => {
    let filtered = clubs;

    if (searchTerm) {
      filtered = filtered.filter(
        (club) =>
          club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          club.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((club) => club.category === selectedCategory);
    }

    setFilteredClubs(filtered);
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading clubs..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clubs & Societies</h1>
        <p className="text-gray-600">Explore student clubs and societies</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clubs..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="academic">Academic</option>
              <option value="social">Social</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredClubs.length} of {clubs.length} clubs
        </div>
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <EmptyState
          title="No clubs found"
          description="Try adjusting your filters"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}
    </div>
  );
};
