import React from 'react';
import TutorApplicationForm from './TutorApplicationForm';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap } from 'lucide-react';

const TutorRegistrationPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
      {/* Back button */}
      <div className="mx-auto mb-6 max-w-2xl">
        <button
          onClick={handleClose}
          className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
        {/* Card header */}
        <div className="rounded-t-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Become a Tutor</h1>
              <p className="text-sm text-blue-100">
                Join our community of expert tutors and help students succeed
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <TutorApplicationForm onClose={handleClose} />
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-center text-xs text-gray-400">
        All newly registered users start as students. Once approved, your role will be updated to Tutor.
      </p>
    </div>
  );
};

export default TutorRegistrationPage;
