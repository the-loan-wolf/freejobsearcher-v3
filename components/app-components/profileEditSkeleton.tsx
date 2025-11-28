import React from 'react';
import { User } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

// Helper component to structure Label + Input/Field pairs
const FormFieldSkeleton = ({ labelWidth = 'w-20', fieldHeight = 'h-10' }) => (
  <div className="space-y-2">
    <Skeleton className={`h-4 ${labelWidth}`} /> {/* Label placeholder */}
    <Skeleton className={`${fieldHeight} w-full`} /> {/* Input/Field placeholder */}
  </div>
);

// Helper component for repeating form groups (Education, Work)
const RepeaterGroupSkeleton = ({ title, fieldCount, itemStructure }: { title?: string; fieldCount?: number; itemStructure: { key: string, labelWidth: string }[] }) => (
  <div className="border border-gray-100 dark:border-gray-800 rounded-lg">
    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
      <Skeleton className="h-6 w-1/3" /> {/* Title placeholder */}
    </div>
    <div className="p-6 space-y-6">
      {[...Array(2)].map((_, i) => ( // Show two representative items
        <div key={i} className="flex items-start space-x-2">
          <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
            {itemStructure.map((field, j) => (
              <FormFieldSkeleton key={j} labelWidth={field.labelWidth} fieldHeight="h-10" />
            ))}
          </div>
          <Skeleton className="h-10 w-10 mt-6 rounded-full" /> {/* Remove button placeholder (X) */}
        </div>
      ))}
      <Skeleton className="h-9 w-32 mt-4" /> {/* Add Button placeholder */}
    </div>
  </div>
);

const ProfileEditSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">

            {/* Profile Information Card (Main Card) */}
            <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 md:p-8 space-y-6">
              {/* Card Header */}
              <div className="border-b pb-4 mb-4 border-gray-100 dark:border-gray-800">
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <Skeleton className="h-7 w-48" /> {/* Card Title */}
                </div>
                <Skeleton className="h-4 w-2/3 mt-2" /> {/* Card Description */}
              </div>

              {/* Card Content - Profile Picture */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Skeleton className="h-24 w-24 rounded-full" /> {/* Profile Pic Upload */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" /> {/* Label */}
                  <Skeleton className="h-10 w-48" /> {/* Placeholder text */}
                </div>
              </div>

              {/* Grid Inputs (Full Name) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormFieldSkeleton labelWidth="w-24" /> {/* Full Name */}
              </div>


              {/* More Inputs (Location, Title, Experience, Salary) */}
              <div className="space-y-6">
                <FormFieldSkeleton labelWidth="w-20" /> {/* Location */}
                <FormFieldSkeleton labelWidth="w-20" /> {/* Job Title */}
                <FormFieldSkeleton labelWidth="w-24" /> {/* Experience */}
                <FormFieldSkeleton labelWidth="w-20" /> {/* Salary */}
              </div>

              {/* Bio Textarea */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" /> {/* Label Bio */}
                <Skeleton className="h-24 w-full" /> {/* Textarea Bio */}
              </div>

              {/* Video Intro Placeholder */}
              <div className="space-y-4 border-t pt-4 border-gray-100 dark:border-gray-800">
                <Skeleton className="h-6 w-40" /> {/* Video Intro Title */}
                <Skeleton className="h-12 w-full" /> {/* Input for YT link */}
              </div>

              {/* EDUCATION Card */}
              <RepeaterGroupSkeleton
                title="Education"
                itemStructure={[
                  { key: 'degree', labelWidth: 'w-16' },
                  { key: 'institution', labelWidth: 'w-24' },
                  { key: 'year', labelWidth: 'w-12' },
                ]}
              />

              {/* WORK HISTORY Card */}
              <RepeaterGroupSkeleton
                title="Work History"
                itemStructure={[
                  { key: 'company', labelWidth: 'w-16' },
                  { key: 'position', labelWidth: 'w-20' },
                  { key: 'duration', labelWidth: 'w-16' },
                ]}
              />

              {/* ACHIEVEMENTS Card */}
              <RepeaterGroupSkeleton
                title="Achievements"
                itemStructure={[{ key: 'achievement', labelWidth: 'w-28' }]}
              />

              {/* SKILLS Card */}
              <RepeaterGroupSkeleton
                title="Skills"
                itemStructure={[{ key: 'skill', labelWidth: 'w-12' }]}
              />

              {/* Save Button */}
              <div className="mt-8">
                <Skeleton className="h-12 w-40" /> {/* Save Changes Button */}
              </div>
            </div>

            {/* Link Button */}
            <div className="flex justify-end p-2">
              <Skeleton className="h-10 w-36" /> {/* Select job Link Button */}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditSkeleton;
