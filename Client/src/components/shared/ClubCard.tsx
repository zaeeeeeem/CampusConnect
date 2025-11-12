import { Club } from '../../types';
import { Link } from 'react-router-dom';

interface ClubCardProps {
  club: Club;
  showJoinButton?: boolean;
  onJoin?: (clubId: string) => void;
  isMember?: boolean;
}

export const ClubCard = ({ club, showJoinButton = false, onJoin, isMember = false }: ClubCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      technical: 'bg-indigo-100 text-indigo-800',
      cultural: 'bg-purple-100 text-purple-800',
      sports: 'bg-green-100 text-green-800',
      academic: 'bg-blue-100 text-blue-800',
      social: 'bg-pink-100 text-pink-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Cover Image */}
      {club.coverImage && (
        <div className="h-32 overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600">
          <img
            src={club.coverImage}
            alt={club.name}
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      )}

      <div className="p-6">
        {/* Logo and Category */}
        <div className="flex items-start justify-between mb-4">
          {club.logo ? (
            <img src={club.logo} alt={club.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md -mt-10" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl -mt-10 border-2 border-white shadow-md">
              {club.name.charAt(0)}
            </div>
          )}

          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(club.category)}`}>
            {club.category}
          </span>
        </div>

        {/* Club Name and Description */}
        <Link to={`/clubs/${club.id}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 mb-2">
            {club.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{club.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{club.members?.length || 0} members</span>
          </div>

          {club.foundedDate && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Since {new Date(club.foundedDate).getFullYear()}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        {club.socialLinks && (
          <div className="flex gap-2 mb-4">
            {club.socialLinks.website && (
              <a
                href={club.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
                </svg>
              </a>
            )}
            {club.socialLinks.instagram && (
              <a
                href={club.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            {club.socialLinks.twitter && (
              <a
                href={club.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Link
            to={`/clubs/${club.id}`}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            View Details →
          </Link>

          {showJoinButton && onJoin && (
            <button
              onClick={() => onJoin(club.id)}
              disabled={isMember}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isMember
                  ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isMember ? 'Member' : 'Join Club'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
