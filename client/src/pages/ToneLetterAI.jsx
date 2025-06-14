import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faSync, 
  faCopy, 
  faEnvelope,
  faLightbulb,
  faDownload
} from '@fortawesome/free-solid-svg-icons';

const EmailGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tones = [
    { value: 'professional', label: 'Professional', icon: faLightbulb },
    { value: 'formal', label: 'Formal', icon: faEnvelope },
    { value: 'friendly', label: 'Friendly', icon: faLightbulb },
    { value: 'urgent', label: 'Urgent', icon: faLightbulb },
  ];

  const examplePrompts = [
    "Write a polite payment reminder for invoice #1234",
    "Compose a follow-up email after a meeting",
    "Create a response to a customer complaint",
    "Generate a sales outreach email for our new product"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(' http://localhost:5000/api/email/generate-email', 
        { prompt, tone },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setContent(response.data.content);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate email');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
  };

  const downloadAsTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'generated-email.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center">
          <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-600" />
          AI Email Generator
        </h2>
        <p className="text-gray-600">Generate professional emails using OpenChat AI</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-6">
          <label className="block text-gray-700 mb-3 font-medium">
            What kind of email would you like to create?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: 'Write a polite payment reminder for client XYZ'"
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32 
              border-gray-300 resize-none"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-3 font-medium">
            Select Tone:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tones.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTone(t.value)}
                className={`flex items-center justify-center p-3 rounded-lg transition-all
                  ${tone === t.value 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                `}
              >
                <FontAwesomeIcon icon={t.icon} className="mr-2" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-3 font-medium">
            Quick Start Examples:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPrompt(example)}
                className="p-3 bg-gray-50 rounded-lg text-left text-sm hover:bg-gray-100 
                  transition-colors text-gray-600"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg 
            font-medium transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-3" />
              Generating...
            </>
          ) : (
            'Generate Email'
          )}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {content && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Generated Email</h3>
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-600 hover:text-blue-600 rounded-full 
                  hover:bg-gray-200 transition-colors"
                title="Copy to clipboard"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
              <button
                onClick={handleSubmit}
                className="p-2 text-gray-600 hover:text-blue-600 rounded-full 
                  hover:bg-gray-200 transition-colors"
                title="Regenerate"
              >
                <FontAwesomeIcon icon={faSync} />
              </button>
              <button
                onClick={downloadAsTxt}
                className="p-2 text-gray-600 hover:text-blue-600 rounded-full 
                  hover:bg-gray-200 transition-colors"
                title="Download as .txt"
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          </div>
          <div className="whitespace-pre-wrap text-gray-700 bg-white p-4 rounded-lg">
            {content.split('\n').map((line, i) => (
              <p key={i} className="mb-3">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailGenerator;