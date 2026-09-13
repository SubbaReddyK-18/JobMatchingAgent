import React from 'react';
import { Check } from 'lucide-react';

export default function StageProgressBar({
  currentStage = 1, // 1: Applied, 2: Shortlisted, 3: Interview, 4: Offer
  status = 'UNDER_REVIEW'
}) {
  const stages = [
    { id: 1, label: 'Applied' },
    { id: 2, label: 'Shortlisted' },
    { id: 3, label: 'Interview' },
    { id: 4, label: 'Offer' }
  ];

  const isRejected = status === 'NOT_SELECTED';
  const isOffer = status === 'OFFER_RECEIVED';

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '320px' }}>
      {stages.map((stage, idx) => {
        const isDone = currentStage > stage.id || (currentStage === 4 && stage.id === 4) || (isOffer && stage.id <= 4);
        const isCurrent = currentStage === stage.id && !isRejected;

        return (
          <React.Fragment key={stage.id}>
            {/* Step Node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isRejected && stage.id === currentStage 
                    ? '#EF4444' 
                    : isDone 
                      ? '#4F46E5' 
                      : isCurrent 
                        ? '#6366F1' 
                        : '#FFFFFF',
                  border: `2px solid ${
                    isRejected && stage.id === currentStage
                      ? '#EF4444'
                      : isDone || isCurrent
                        ? '#4F46E5'
                        : '#CBD5E1'
                  }`,
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 700,
                  transition: 'all 0.3s ease'
                }}
              >
                {isDone ? (
                  <Check size={11} strokeWidth={3} />
                ) : (
                  <span style={{ color: isCurrent ? '#FFFFFF' : '#94A3B8', fontSize: '9px' }}>•</span>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: isCurrent || isDone ? 700 : 500,
                  color: isRejected && stage.id === currentStage ? '#EF4444' : isDone || isCurrent ? '#0F172A' : '#94A3B8',
                  marginTop: '4px',
                  whiteSpace: 'nowrap'
                }}
              >
                {stage.label}
              </span>
            </div>

            {/* Connecting Bar */}
            {idx < stages.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '3px',
                  backgroundColor: currentStage > stage.id ? '#4F46E5' : '#E2E8F0',
                  margin: '0 4px',
                  marginBottom: '18px',
                  borderRadius: '2px',
                  transition: 'background-color 0.3s ease'
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
