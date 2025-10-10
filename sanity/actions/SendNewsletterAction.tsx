import { DocumentActionComponent } from 'sanity';
import { useState } from 'react';

// Preview Newsletter Action
export const PreviewNewsletterAction: DocumentActionComponent = (props) => {
  const { id, type, draft, published } = props;

  // Only show this action for newsletter documents
  if (type !== 'newsletter') {
    return null;
  }

  const doc = draft || published;

  const handlePreview = () => {
    const baseUrl = process.env.SANITY_STUDIO_API_URL || window.location.origin;
    const previewUrl = `${baseUrl}/api/newsletter/preview`;

    // Open preview in new window
    const previewWindow = window.open('about:blank', '_blank');

    if (previewWindow) {
      previewWindow.document.write('<div style="text-align: center; padding: 50px;">Loading preview...</div>');

      fetch(previewUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newsletterId: id,
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to load preview');
          }
          return response.text();
        })
        .then(html => {
          previewWindow.document.open();
          previewWindow.document.write(html);
          previewWindow.document.close();
        })
        .catch(error => {
          console.error('Error previewing newsletter:', error);
          previewWindow.document.write(`
            <div style="text-align: center; padding: 50px; color: red;">
              <h2>Preview Failed</h2>
              <p>${error.message}</p>
              <p>Make sure your newsletter has content and the server is running.</p>
            </div>
          `);
        });
    }
  };

  return {
    label: 'Preview Email',
    icon: () => '👁️',
    disabled: !doc?.subject || !doc?.content,
    onHandle: handlePreview,
  };
};

// Send Newsletter Action
export const SendNewsletterAction: DocumentActionComponent = (props) => {
  const { id, type, draft, published } = props;
  const [isSending, setIsSending] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Only show this action for newsletter documents
  if (type !== 'newsletter') {
    return null;
  }

  // Get the document to check status
  const doc = draft || published;
  const status = doc?.status;
  const recipientCount = doc?.recipientCount || 0;

  // Don't show send button if already sent
  if (status === 'sent') {
    return {
      label: `Sent to ${recipientCount} subscribers`,
      disabled: true,
      icon: () => '✅',
    };
  }

  const handleSend = async () => {
    setIsSending(true);

    try {
      const baseUrl = process.env.SANITY_STUDIO_API_URL || window.location.origin;
      const response = await fetch(`${baseUrl}/api/newsletter/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newsletterId: id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send newsletter');
      }

      // Show success message
      alert(
        `✅ Newsletter sent successfully!\n\n` +
        `Recipients: ${result.recipientCount}\n` +
        `Successful: ${result.successCount}\n` +
        `Failed: ${result.failureCount}`
      );

      // Close dialog
      setDialogOpen(false);

      // Refresh the document to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert(`❌ Failed to send newsletter: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handlePreview = () => {
    const baseUrl = process.env.SANITY_STUDIO_API_URL || window.location.origin;
    const previewUrl = `${baseUrl}/api/newsletter/preview`;

    // Open preview in new window
    const previewWindow = window.open('about:blank', '_blank');

    if (previewWindow) {
      fetch(previewUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newsletterId: id,
        }),
      })
        .then(response => response.text())
        .then(html => {
          previewWindow.document.write(html);
          previewWindow.document.close();
        })
        .catch(error => {
          console.error('Error previewing newsletter:', error);
          alert('Failed to preview newsletter');
          previewWindow.close();
        });
    }
  };

  return {
    label: isSending ? 'Sending...' : 'Send Newsletter',
    icon: () => '📧',
    disabled: isSending || !doc?.subject || !doc?.content,
    onHandle: () => {
      setDialogOpen(true);
    },
    dialog: dialogOpen && {
      type: 'confirm',
      tone: 'critical',
      onCancel: () => {
        setDialogOpen(false);
      },
      onConfirm: handleSend,
      message: (
        <div style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '16px' }}>⚠️ Send Newsletter</h3>

          {/* Show audience warning */}
          <div style={{
            padding: '16px',
            backgroundColor: doc?.audienceType === 'test' ? '#d1f4e0' : '#fff3cd',
            border: `2px solid ${doc?.audienceType === 'test' ? '#28a745' : '#ffc107'}`,
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>
              {doc?.audienceType === 'test'
                ? `📧 TEST MODE: Sending to ${doc?.testEmail || 'NO EMAIL SET!'}`
                : doc?.audienceType === 'tags'
                ? `🏷️ FILTERED: Sending to subscribers with tags: ${Array.isArray(doc?.filterTags) ? doc.filterTags.join(', ') : 'NONE'}`
                : doc?.audienceType === 'interests'
                ? `🎯 FILTERED: Sending to subscribers interested in: ${Array.isArray(doc?.filterInterests) ? doc.filterInterests.join(', ') : 'NONE'}`
                : '👥 Sending to ALL ACTIVE SUBSCRIBERS'
              }
            </p>
          </div>

          <p style={{ marginBottom: '16px', color: '#666' }}>
            <strong>Subject:</strong> {String(doc?.subject || '')}
          </p>

          {/* Warning if test mode without email */}
          {doc?.audienceType === 'test' && !doc?.testEmail && (
            <div style={{
              padding: '12px',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              marginBottom: '16px',
              color: '#721c24'
            }}>
              <strong>⛔ ERROR:</strong> Test mode selected but no test email address provided!
            </div>
          )}

          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f4f4f4', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              💡 <strong>Tip:</strong> Preview before sending
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                handlePreview();
              }}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              👁️ Preview Email
            </button>
          </div>
        </div>
      ),
    },
  };
};
