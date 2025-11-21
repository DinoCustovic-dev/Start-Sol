import { CheckCircle } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className='flex items-center justify-center mb-6 sm:mb-8 px-2'>
      {[1, 2, 3].map((s) => (
        <div key={s} className='flex items-center'>
          <div
            className={`
              w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base
              ${
                currentStep >= s
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-400'
              }
            `}
          >
            {currentStep > s ? (
              <CheckCircle className='w-5 h-5 sm:w-6 sm:h-6' />
            ) : (
              s
            )}
          </div>
          {s < 3 && (
            <div
              className={`w-12 sm:w-16 md:w-24 h-1 mx-1 sm:mx-2 ${
                currentStep > s ? 'bg-purple-500' : 'bg-gray-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
