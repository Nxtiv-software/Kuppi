import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  GraduationCap,
  BookOpen,
  CheckSquare,
  Loader2,
} from 'lucide-react';
import { submitTutorApplication } from '../../services/api';

// ─── Constants ────────────────────────────────────────────────────────────────

const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
  'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle',
  'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala',
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
  'Trincomalee', 'Vavuniya',
];

const LANGUAGES = ['Sinhala', 'English', 'Tamil'];

const QUALIFICATIONS = ['A/L', 'Diploma', 'Undergraduate', 'Graduate', 'Postgraduate'];

const AL_STREAMS = [
  'Physical Science',
  'Biological Science',
  'Commerce',
  'Arts',
  'Technology',
  'Other',
];

const SUBJECTS = [
  'Combined Maths', 'Physics', 'Chemistry', 'Biology', 'Mathematics',
  'Economics', 'Accounting', 'Business Studies', 'History', 'Geography',
  'Sinhala', 'English', 'Tamil', 'ICT', 'Art', 'Music',
];

const GRADES = [
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11',
  'O/L', 'A/L',
];

const DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Education', icon: GraduationCap },
  { id: 3, label: 'Teaching', icon: BookOpen },
  { id: 4, label: 'Review & Submit', icon: CheckSquare },
];

// ─── Shared small components ──────────────────────────────────────────────────

const inputCls =
  'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 ' +
  'transition-all duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100';

const Field = ({ label, required, hint, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-0.5 text-blue-600">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const CheckPill = ({ label, checked, onChange }) => (
  <label
    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all select-none ${
      checked
        ? 'border-blue-500 bg-blue-50 text-blue-700'
        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
    }`}
  >
    <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
    <span
      className={`h-4 w-4 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
        checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
      }`}
    >
      {checked && <Check size={10} strokeWidth={3} className="text-white" />}
    </span>
    {label}
  </label>
);

const RadioPill = ({ label, checked, onChange }) => (
  <label
    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-all select-none ${
      checked
        ? 'border-blue-500 bg-blue-50 text-blue-700'
        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
    }`}
  >
    <input type="radio" className="sr-only" checked={checked} onChange={onChange} />
    <span
      className={`h-4 w-4 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
        checked ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      {checked && <span className="h-2 w-2 rounded-full bg-blue-500" />}
    </span>
    {label}
  </label>
);

const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-5">
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
  </div>
);

// ─── Step 1 – Personal Info ───────────────────────────────────────────────────

const Step1 = ({ form, handleInput, fieldErrors }) => (
  <div>
    <SectionTitle title="Personal Information" subtitle="Tell us a little about yourself" />
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Full Name" required error={fieldErrors.fullName}>
        <input
          className={inputCls}
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleInput}
          placeholder="Nimal Perera"
        />
      </Field>

      <Field label="NIC Number" required error={fieldErrors.nicNumber}>
        <input
          className={inputCls}
          type="text"
          name="nicNumber"
          value={form.nicNumber}
          onChange={handleInput}
          placeholder="200012345678"
        />
      </Field>

      <Field label="Date of Birth" required error={fieldErrors.dateOfBirth}>
        <input
          className={inputCls}
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleInput}
        />
      </Field>

      <Field label="Phone Number" required error={fieldErrors.phone}>
        <input
          className={inputCls}
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleInput}
          placeholder="0771234567"
        />
      </Field>

      <Field label="District" required error={fieldErrors.district}>
        <select
          className={inputCls}
          name="district"
          value={form.district}
          onChange={handleInput}
        >
          <option value="">Select district</option>
          {SRI_LANKA_DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </Field>

      <Field label="City" required error={fieldErrors.city}>
        <input
          className={inputCls}
          type="text"
          name="city"
          value={form.city}
          onChange={handleInput}
          placeholder="Maharagama"
        />
      </Field>
    </div>
  </div>
);

// ─── Step 2 – Education & Profile ────────────────────────────────────────────

const Step2 = ({ form, handleInput, toggleArray, fieldErrors }) => (
  <div className="space-y-5">
    <SectionTitle title="Education & Profile" subtitle="Your background and qualifications" />

    <Field
      label="Short Bio"
      hint="Tell students about yourself and your teaching style."
      error={fieldErrors.bio}
    >
      <textarea
        className={`${inputCls} resize-none`}
        name="bio"
        value={form.bio}
        onChange={handleInput}
        rows={3}
        placeholder="A/L mathematics tutor with 3 years experience..."
      />
    </Field>

    <Field label="Languages Spoken" required error={fieldErrors.languages}>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <CheckPill
            key={lang}
            label={lang}
            checked={form.languages.includes(lang)}
            onChange={() => toggleArray('languages', lang)}
          />
        ))}
      </div>
    </Field>

    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Highest Qualification" required error={fieldErrors.qualification}>
        <select
          className={inputCls}
          name="qualification"
          value={form.qualification}
          onChange={handleInput}
        >
          <option value="">Select qualification</option>
          {QUALIFICATIONS.map((q) => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>
      </Field>

      <Field label="University / Institute">
        <input
          className={inputCls}
          type="text"
          name="university"
          value={form.university}
          onChange={handleInput}
          placeholder="IIT, University of Colombo…"
        />
      </Field>

      <Field label="Field of Study">
        <input
          className={inputCls}
          type="text"
          name="fieldOfStudy"
          value={form.fieldOfStudy}
          onChange={handleInput}
          placeholder="Computer Science"
        />
      </Field>

      <Field label="Graduation Year">
        <input
          className={inputCls}
          type="number"
          name="graduationYear"
          value={form.graduationYear}
          onChange={handleInput}
          placeholder="2026"
          min="1990"
          max="2035"
        />
      </Field>

      <Field label="A/L Stream">
        <select
          className={inputCls}
          name="alStream"
          value={form.alStream}
          onChange={handleInput}
        >
          <option value="">Select A/L stream</option>
          {AL_STREAMS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>
    </div>

    <Field
      label="A/L Results"
      hint="e.g. Combined Maths - A, Physics - B, Chemistry - A"
    >
      <textarea
        className={`${inputCls} resize-none`}
        name="alResults"
        value={form.alResults}
        onChange={handleInput}
        rows={2}
        placeholder="Combined Maths - A, Physics - B, Chemistry - A"
      />
    </Field>
  </div>
);

// ─── Step 3 – Teaching Details ────────────────────────────────────────────────

const Step3 = ({ form, handleInput, toggleArray, fieldErrors }) => (
  <div className="space-y-5">
    <SectionTitle title="Teaching Details" subtitle="What and how you teach" />

    <Field label="Subjects You Teach" required error={fieldErrors.subjects}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SUBJECTS.map((s) => (
          <CheckPill
            key={s}
            label={s}
            checked={form.subjects.includes(s)}
            onChange={() => toggleArray('subjects', s)}
          />
        ))}
      </div>
    </Field>

    <Field label="Grades You Teach">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {GRADES.map((g) => (
          <CheckPill
            key={g}
            label={g}
            checked={form.grades.includes(g)}
            onChange={() => toggleArray('grades', g)}
          />
        ))}
      </div>
    </Field>

    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Years of Experience">
        <input
          className={inputCls}
          type="number"
          name="experienceYears"
          value={form.experienceYears}
          onChange={handleInput}
          placeholder="3"
          min="0"
          max="50"
        />
      </Field>

      <Field label="Teaching Type" required error={fieldErrors.teachingType}>
        <div className="flex flex-wrap gap-2">
          {['Online', 'Physical', 'Both'].map((type) => (
            <RadioPill
              key={type}
              label={`${type} Classes`}
              checked={form.teachingType === type}
              onChange={() =>
                handleInput({ target: { name: 'teachingType', value: type } })
              }
            />
          ))}
        </div>
      </Field>
    </div>

    <Field label="Available Days">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {DAYS.map((d) => (
          <CheckPill
            key={d}
            label={d}
            checked={form.availableDays.includes(d)}
            onChange={() => toggleArray('availableDays', d)}
          />
        ))}
      </div>
    </Field>

    <Field label="Available Time" hint="e.g. 6 PM – 9 PM">
      <input
        className={inputCls}
        type="text"
        name="availability"
        value={form.availability}
        onChange={handleInput}
        placeholder="6 PM – 9 PM"
      />
    </Field>

    {/* Optional verification links */}
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Optional Verification Links
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="LinkedIn Profile">
          <input
            className={inputCls}
            type="url"
            name="linkedin"
            value={form.linkedin}
            onChange={handleInput}
            placeholder="https://linkedin.com/in/yourname"
          />
        </Field>
        <Field label="Certificate Google Drive Link">
          <input
            className={inputCls}
            type="url"
            name="certificateLink"
            value={form.certificateLink}
            onChange={handleInput}
            placeholder="https://drive.google.com/…"
          />
        </Field>
      </div>
    </div>
  </div>
);

// ─── Step 4 – Review & Submit ─────────────────────────────────────────────────

const ReviewRow = ({ label, value }) => {
  const display = Array.isArray(value) ? value.join(', ') : String(value || '');
  if (!display) return null;
  return (
    <div className="flex gap-3 border-b border-gray-100 py-2 text-sm last:border-0">
      <span className="w-44 flex-shrink-0 text-gray-400">{label}</span>
      <span className="font-medium text-gray-800">{display}</span>
    </div>
  );
};

const ReviewBlock = ({ title, rows }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
    {rows.map(([label, value]) => (
      <ReviewRow key={label} label={label} value={value} />
    ))}
  </div>
);

const Step4 = ({ form, set, fieldErrors }) => (
  <div className="space-y-4">
    <SectionTitle title="Review & Submit" subtitle="Check your details before submitting" />

    <ReviewBlock
      title="Personal"
      rows={[
        ['Full Name', form.fullName],
        ['NIC Number', form.nicNumber],
        ['Date of Birth', form.dateOfBirth],
        ['Phone', form.phone],
        ['District', form.district],
        ['City', form.city],
      ]}
    />

    <ReviewBlock
      title="Education"
      rows={[
        ['Bio', form.bio],
        ['Languages', form.languages],
        ['Qualification', form.qualification],
        ['University', form.university],
        ['Field of Study', form.fieldOfStudy],
        ['Graduation Year', form.graduationYear],
        ['A/L Stream', form.alStream],
        ['A/L Results', form.alResults],
      ]}
    />

    <ReviewBlock
      title="Teaching"
      rows={[
        ['Subjects', form.subjects],
        ['Grades', form.grades],
        ['Experience (yrs)', form.experienceYears],
        ['Teaching Type', form.teachingType],
        ['Available Days', form.availableDays],
        ['Available Time', form.availability],
        ['LinkedIn', form.linkedin],
        ['Certificate Link', form.certificateLink],
      ]}
    />

    {/* Agreement */}
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all select-none ${
        form.agreed
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-blue-300'
      }`}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={form.agreed}
        onChange={(e) => set('agreed', e.target.checked)}
      />
      <span
        className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
          form.agreed ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
        }`}
      >
        {form.agreed && <Check size={12} strokeWidth={3} className="text-white" />}
      </span>
      <span className="text-sm text-gray-700">
        I confirm that the information provided is accurate.
      </span>
    </label>
    {fieldErrors.agreed && (
      <p className="text-xs text-red-500">{fieldErrors.agreed}</p>
    )}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const TutorApplicationForm = ({ onClose }) => {
  const { user } = useUser();
  const TOTAL_STEPS = 4;
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [animating, setAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    // Step 1
    fullName: '',
    nicNumber: '',
    dateOfBirth: '',
    phone: '',
    district: '',
    city: '',
    // Step 2
    bio: '',
    languages: [],
    qualification: '',
    university: '',
    fieldOfStudy: '',
    graduationYear: '',
    alStream: '',
    alResults: '',
    // Step 3
    subjects: [],
    grades: [],
    experienceYears: '',
    experienceDescription: '',
    teachingType: '',
    availableDays: [],
    availability: '',
    linkedin: '',
    certificateLink: '',
    // Step 4
    agreed: false,
  });

  // ── Helpers ──────────────────────────────────────────────────────────────

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    set(name, type === 'checkbox' ? checked : value);
  };

  const toggleArray = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validateStep = (s) => {
    const errs = {};
    if (s === 1) {
      if (!form.fullName.trim()) errs.fullName = 'Full name is required';
      if (!form.nicNumber.trim()) errs.nicNumber = 'NIC number is required';
      if (!form.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
      if (!form.phone.trim()) errs.phone = 'Phone number is required';
      if (!form.district) errs.district = 'District is required';
      if (!form.city.trim()) errs.city = 'City is required';
    }
    if (s === 2) {
      if (form.languages.length === 0) errs.languages = 'Select at least one language';
      if (!form.qualification) errs.qualification = 'Qualification is required';
    }
    if (s === 3) {
      if (form.subjects.length === 0) errs.subjects = 'Select at least one subject';
      if (!form.teachingType) errs.teachingType = 'Teaching type is required';
    }
    if (s === 4) {
      if (!form.agreed) errs.agreed = 'You must confirm the information is accurate';
    }
    return errs;
  };

  // ── Navigation ────────────────────────────────────────────────────────────

  const goNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    if (step === TOTAL_STEPS) {
      handleSubmit();
      return;
    }
    setDirection('forward');
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
    }, 180);
  };

  const goBack = () => {
    if (step === 1) return;
    setDirection('back');
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setAnimating(false);
    }, 180);
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const errs = validateStep(4);
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitTutorApplication({
        email: user?.primaryEmailAddress?.emailAddress || '',
        fullName: form.fullName,
        nicNumber: form.nicNumber,
        dateOfBirth: form.dateOfBirth,
        phone: form.phone,
        district: form.district,
        city: form.city,
        bio: form.bio,
        languages: form.languages,
        qualification: form.qualification,
        university: form.university,
        fieldOfStudy: form.fieldOfStudy,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
        alStream: form.alStream,
        alResults: form.alResults,
        subjects: form.subjects,
        grades: form.grades,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : 0,
        experienceDescription: form.experienceDescription,
        teachingType: form.teachingType,
        availableDays: form.availableDays,
        availability: form.availability,
        linkedin: form.linkedin,
        certificateLink: form.certificateLink,
      });
      localStorage.setItem('tutorApplicationStatus', 'pending');
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Animation class ───────────────────────────────────────────────────────

  const slideClass = animating
    ? direction === 'forward'
      ? 'opacity-0 translate-x-6'
      : 'opacity-0 -translate-x-6'
    : 'opacity-100 translate-x-0';

  const progressPct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

  // ── Success screen ────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Check size={40} className="text-green-600" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
          <p className="mt-2 text-gray-500 max-w-md">
            Your tutor application has been submitted successfully.
            <br />
            Our admin team will review your application.
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const done = step > s.id;
            const current = step === s.id;
            return (
              <div key={s.id} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    done
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : current
                      ? 'border-blue-600 bg-white text-blue-600 shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-gray-400'
                  }`}
                >
                  {done ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <Icon size={16} strokeWidth={current ? 2.5 : 1.5} />
                  )}
                </div>
                <span
                  className={`hidden text-xs sm:block ${
                    current
                      ? 'font-semibold text-blue-600'
                      : done
                      ? 'text-blue-400'
                      : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Segmented bar */}
        <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-gray-400">
          Step {step} of {TOTAL_STEPS} · Estimated time: 2 minutes
        </p>
      </div>

      {/* Form content with slide animation */}
      <div className={`transition-all duration-200 ease-in-out ${slideClass}`}>
        {step === 1 && (
          <Step1 form={form} handleInput={handleInput} fieldErrors={fieldErrors} />
        )}
        {step === 2 && (
          <Step2
            form={form}
            handleInput={handleInput}
            toggleArray={toggleArray}
            fieldErrors={fieldErrors}
          />
        )}
        {step === 3 && (
          <Step3
            form={form}
            handleInput={handleInput}
            toggleArray={toggleArray}
            fieldErrors={fieldErrors}
          />
        )}
        {step === 4 && (
          <Step4
            form={form}
            set={set}
            fieldErrors={fieldErrors}
          />
        )}
      </div>

      {/* Global submission error */}
      {submitError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={submitting}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting…
            </>
          ) : step === TOTAL_STEPS ? (
            <>
              <Check size={16} />
              Submit Application
            </>
          ) : (
            <>
              Continue
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TutorApplicationForm;
