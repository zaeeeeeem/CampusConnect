import { useState, useEffect } from 'react';
import { certificateService } from '../../api/services';
import { Certificate } from '../../types';
import { LoadingSpinner, EmptyState } from '../../components/shared';

export const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const response = await certificateService.getMyCertificates();
      if (response.success) {
        setCertificates(response.data);
      }
    } catch (error) {
      console.error('Failed to load certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificate: Certificate) => {
    try {
      const blob = await certificateService.download(certificate.certificateUrl);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificate.eventName}_certificate.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download certificate');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your certificates..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
        <p className="text-gray-600">
          You have earned {certificates.length} certificate{certificates.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <EmptyState
          title="No certificates yet"
          description="Participate in events to earn certificates"
          action={{
            label: 'Browse Events',
            onClick: () => (window.location.href = '/student/events'),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Certificate Preview */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 opacity-80"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-xl font-bold mb-2">Certificate of Participation</h3>
                  <p className="text-indigo-100 text-sm">Awarded to</p>
                  <p className="text-lg font-semibold">{certificate.userName}</p>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-6">
                <h4 className="font-bold text-gray-900 mb-2 text-lg">{certificate.eventName}</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Issued: {new Date(certificate.issuedDate).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(certificate)}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </button>

                  <button
                    onClick={() => window.open(certificate.certificateUrl, '_blank')}
                    className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
