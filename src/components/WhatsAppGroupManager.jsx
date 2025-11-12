import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  addWhatsAppGroupLink, 
  getWhatsAppGroupLink, 
  removeWhatsAppGroupLink,
  getSessionMembers 
} from '../services/api';

const WhatsAppGroupManager = ({ session, sessionId, isTutor = false, onClose }) => {
  // Support both session object and direct sessionId
  const actualSessionId = session?._id || session?.id || sessionId;
  const [isEditing, setIsEditing] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const queryClient = useQueryClient();

  // Fetch WhatsApp link
  const { data: linkData, isLoading: linkLoading } = useQuery({
    queryKey: ['whatsappLink', actualSessionId],
    queryFn: () => getWhatsAppGroupLink(actualSessionId),
    enabled: !!actualSessionId
  });

  // Fetch session members
  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ['sessionMembers', actualSessionId],
    queryFn: () => getSessionMembers(actualSessionId),
    enabled: showMembers && !!actualSessionId
  });

  // Add/Update WhatsApp link mutation
  const addLinkMutation = useMutation({
    mutationFn: (link) => addWhatsAppGroupLink(actualSessionId, link),
    onSuccess: () => {
      queryClient.invalidateQueries(['whatsappLink', actualSessionId]);
      setIsEditing(false);
      setWhatsappLink('');
      alert('✅ WhatsApp group link added successfully!');
    },
    onError: (error) => {
      alert('❌ Error: ' + error.message);
    }
  });

  // Remove WhatsApp link mutation
  const removeLinkMutation = useMutation({
    mutationFn: () => removeWhatsAppGroupLink(actualSessionId),
    onSuccess: () => {
      queryClient.invalidateQueries(['whatsappLink', actualSessionId]);
      alert('✅ WhatsApp group link removed successfully!');
    },
    onError: (error) => {
      alert('❌ Error: ' + error.message);
    }
  });

  const handleAddLink = () => {
    if (!whatsappLink.trim()) {
      alert('Please enter a WhatsApp group link');
      return;
    }

    // Validate WhatsApp link format
    const whatsappPattern = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+$/;
    if (!whatsappPattern.test(whatsappLink)) {
      alert('Invalid WhatsApp group link format. Must be: https://chat.whatsapp.com/...');
      return;
    }

    addLinkMutation.mutate(whatsappLink);
  };

  const handleRemoveLink = () => {
    if (window.confirm('Are you sure you want to remove the WhatsApp group link?')) {
      removeLinkMutation.mutate();
    }
  };

  const handleJoinGroup = () => {
    if (linkData?.data?.whatsappGroupLink) {
      window.open(linkData.data.whatsappGroupLink, '_blank');
    }
  };

  if (linkLoading) {
    return <div className="loading">Loading WhatsApp group info...</div>;
  }

  const hasLink = linkData?.data?.hasLink;
  const groupLink = linkData?.data?.whatsappGroupLink;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            📱 WhatsApp Group
          </h3>
          {onClose && (
            <button onClick={onClose} style={styles.closeButton}>
              ✕
            </button>
          )}
        </div>
        <div style={styles.container}>

      {!hasLink && !isEditing && (
        <div style={styles.noLink}>
          <p style={styles.noLinkText}>
            {isTutor 
              ? '📝 No WhatsApp group created yet. Add a link to enable group communication!'
              : '⏳ WhatsApp group link not yet available. The tutor will add it soon.'}
          </p>
          {isTutor && (
            <button onClick={() => setIsEditing(true)} style={styles.addButton}>
              ➕ Add WhatsApp Group Link
            </button>
          )}
        </div>
      )}

      {hasLink && !isEditing && (
        <div style={styles.linkCard}>
          <div style={styles.linkInfo}>
            <span style={styles.linkIcon}>✅</span>
            <span style={styles.linkText}>WhatsApp group is active!</span>
          </div>
          
          <button onClick={handleJoinGroup} style={styles.joinButton}>
            📱 Join WhatsApp Group
          </button>

          {isTutor && (
            <div style={styles.tutorActions}>
              <button onClick={() => setIsEditing(true)} style={styles.editButton}>
                ✏️ Update Link
              </button>
              <button onClick={handleRemoveLink} style={styles.removeButton}>
                🗑️ Remove Link
              </button>
            </div>
          )}

          <button 
            onClick={() => setShowMembers(!showMembers)} 
            style={styles.membersToggle}
          >
            {showMembers ? '▼' : '▶'} View Group Members
          </button>

          {showMembers && (
            <div style={styles.membersSection}>
              {membersLoading ? (
                <p>Loading members...</p>
              ) : (
                <>
                  <p style={styles.memberCount}>
                    👥 {membersData?.data?.totalMembers || 0} members
                  </p>
                  
                  <div style={styles.tutorCard}>
                    <strong>👨‍🏫 Tutor:</strong>
                    <p>{membersData?.data?.tutor?.name}</p>
                  </div>

                  <div style={styles.studentsList}>
                    <strong>👨‍🎓 Students:</strong>
                    {membersData?.data?.students?.map((student, index) => (
                      <div key={student.id} style={styles.studentItem}>
                        {index + 1}. {student.name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div style={styles.editForm}>
          <label style={styles.label}>
            WhatsApp Group Link:
          </label>
          <input
            type="url"
            value={whatsappLink}
            onChange={(e) => setWhatsappLink(e.target.value)}
            placeholder="https://chat.whatsapp.com/..."
            style={styles.input}
          />
          <p style={styles.hint}>
            💡 Create a WhatsApp group, then get the invite link from Group Info → Invite via link
          </p>
          
          <div style={styles.formActions}>
            <button 
              onClick={handleAddLink} 
              disabled={addLinkMutation.isLoading}
              style={styles.saveButton}
            >
              {addLinkMutation.isLoading ? '⏳ Saving...' : '💾 Save Link'}
            </button>
            <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>
              ❌ Cancel
            </button>
          </div>
        </div>
      )}
      </div>
      </div>
    </div>
  );
};

// Inline styles for the component
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  },
  container: {
    padding: '0'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #25D366',
    paddingBottom: '1rem',
    marginBottom: '1.5rem'
  },
  title: {
    margin: 0,
    color: '#25D366',
    fontSize: '1.5rem',
    fontWeight: '600'
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#666',
    padding: '0.25rem 0.5rem',
    lineHeight: 1
  },
  noLink: {
    textAlign: 'center',
    padding: '1rem'
  },
  noLinkText: {
    color: '#666',
    marginBottom: '1rem'
  },
  addButton: {
    backgroundColor: '#25D366',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.3s'
  },
  linkCard: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '6px'
  },
  linkInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  linkIcon: {
    fontSize: '1.5rem'
  },
  linkText: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#333'
  },
  joinButton: {
    backgroundColor: '#25D366',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    width: '100%',
    marginBottom: '0.5rem',
    transition: 'background-color 0.3s'
  },
  tutorActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  removeButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  membersToggle: {
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    width: '100%',
    marginTop: '0.5rem'
  },
  membersSection: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '6px'
  },
  memberCount: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '1rem'
  },
  tutorCard: {
    padding: '0.75rem',
    backgroundColor: '#e3f2fd',
    borderRadius: '6px',
    marginBottom: '1rem'
  },
  studentsList: {
    padding: '0.75rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px'
  },
  studentItem: {
    padding: '0.5rem',
    borderBottom: '1px solid #ddd',
    fontSize: '0.9rem'
  },
  editForm: {
    padding: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    marginBottom: '0.5rem'
  },
  hint: {
    fontSize: '0.85rem',
    color: '#666',
    fontStyle: 'italic',
    marginBottom: '1rem'
  },
  formActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#25D366',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500'
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666'
  }
};

export default WhatsAppGroupManager;
