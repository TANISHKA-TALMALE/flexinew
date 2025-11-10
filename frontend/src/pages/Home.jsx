import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../services/api';

// Utility: determine if a hex color is dark for auto-contrast
function isHexDark(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  // Perceived luminance (WCAG-ish)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.5;
}

const defaultFields = {
  name: 'John Doe',
  title: 'Product Manager',
  company: 'Acme Inc.',
  phone: '+1 (555) 123-4567',
  email: 'john.doe@example.com',
  website: 'www.example.com',
  address: '123 Business Rd, City, Country',
};

const defaultStyle = {
  bgColor: '#ffffff',
  textColor: '#111111',
  accentColor: '#0ea5e9',
  fontFamily: "Inter, Arial, sans-serif",
};

export default function Home() {
  const [title, setTitle] = useState('My Card');
  const [fields, setFields] = useState(defaultFields);
  const [style, setStyle] = useState(defaultStyle);
  const [template, setTemplate] = useState('modern');
  const [logoDataUrl, setLogoDataUrl] = useState('');
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');
  const cardRef = useRef(null);

  const onFieldChange = (e) => setFields({ ...fields, [e.target.name]: e.target.value });
  const onStyleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'bgColor') {
      const dark = isHexDark(value);
      setStyle({
        ...style,
        bgColor: value,
        textColor: dark ? '#ffffff' : '#111111',
      });
      return;
    }
    setStyle({ ...style, [name]: value });
  };

  const onLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const saveCard = async () => {
    setError('');
    try {
      const { data } = await api.post('/cards', { title, fields, style, logoDataUrl });
      setCards([data, ...cards]);
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed');
    }
  };

  const deleteCard = async (id) => {
    setError('');
    try {
      await api.delete(`/cards/${id}`);
      setCards(cards.filter((c) => c._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed');
    }
  };

  const exportPNG = async () => {
    const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${title || 'business-card'}.png`;
    link.click();
  };

  const exportPDF = async () => {
    const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'pt', [canvas.width, canvas.height]);
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${title || 'business-card'}.pdf`);
  };

  const loadCards = async () => {
    try {
      const { data } = await api.get('/cards');
      setCards(data);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => { loadCards(); }, []);

  return (
    <>
      <div className="page-header">
        <span className="badge"><span className="dot" /> Design Studio</span>
        <h1 className="page-title">Business Card Designer</h1>
        <p className="muted">Craft professional cards with clean templates and smart contrast.</p>
      </div>

      <div className="designer-grid">
        <div className="panel">
          <h2>Designer</h2>
          {error && <p style={{ color: 'salmon' }}>{error}</p>}
          <div className="controls">
            <input className="input" placeholder="Design title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="row">
            <select className="select" value={template} onChange={(e) => setTemplate(e.target.value)}>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="classic">Classic</option>
            </select>
            <select className="select" name="fontFamily" value={style.fontFamily} onChange={onStyleChange}>
              <option value="Inter, Arial, sans-serif">Inter</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
            </select>
          </div>

          <input className="input" name="name" placeholder="Name" value={fields.name} onChange={onFieldChange} />
          <input className="input" name="title" placeholder="Job Title" value={fields.title} onChange={onFieldChange} />
          <input className="input" name="company" placeholder="Company" value={fields.company} onChange={onFieldChange} />
          <div className="row">
            <input className="input" name="phone" placeholder="Phone" value={fields.phone} onChange={onFieldChange} />
            <input className="input" name="email" placeholder="Email" value={fields.email} onChange={onFieldChange} />
          </div>
          <div className="row">
            <input className="input" name="website" placeholder="Website" value={fields.website} onChange={onFieldChange} />
            <input className="input" name="address" placeholder="Address" value={fields.address} onChange={onFieldChange} />
          </div>

          <div className="row">
            <input className="file" type="file" accept="image/*" onChange={onLogoChange} />
          </div>

          <div className="row">
            <label className="muted" style={{ display: 'grid' }}>Background
              <input className="color" type="color" name="bgColor" value={style.bgColor} onChange={onStyleChange} />
            </label>
            <label className="muted" style={{ display: 'grid' }}>Text
              <input className="color" type="color" name="textColor" value={style.textColor} onChange={onStyleChange} />
            </label>
            <label className="muted" style={{ display: 'grid' }}>Accent
              <input className="color" type="color" name="accentColor" value={style.accentColor} onChange={onStyleChange} />
            </label>
          </div>

          <div className="row">
            <button className="btn primary" onClick={saveCard}>Save Design</button>
            <button className="btn" onClick={exportPNG}>Export PNG</button>
            <button className="btn" onClick={exportPDF}>Export PDF</button>
          </div>
        </div>
      </div>

      <div className="panel canvas-wrap">
        <h2>Preview</h2>
        <div className="canvas" ref={cardRef}>
          <div
            className={`card template-${template}`}
            style={{
              '--bg-color': style.bgColor,
              '--text-color': style.textColor,
              '--accent-color': style.accentColor,
              '--font-family': style.fontFamily,
            }}
          >
            <div className="accent" />
            <div className="row">
              <div className="logo">
                {logoDataUrl ? (
                  <img src={logoDataUrl} alt="logo" style={{ maxWidth: '100%', maxHeight: '80%' }} />
                ) : (
                  <div className="placeholder" />
                )}
              </div>
              <div className="content">
                <h3>{fields.name}</h3>
                <p className="role" style={{ color: style.accentColor, margin: '6px 0' }}>{fields.title}</p>
                <p className="company">{fields.company}</p>
                <p className="line">📞 {fields.phone}</p>
                <p className="line">✉️ {fields.email}</p>
                <p className="line">🔗 {fields.website}</p>
                <p className="line">📍 {fields.address}</p>
              </div>
            </div>
          </div>
        </div>

        <h2 style={{ marginTop: 24 }}>My Saved Designs</h2>
        <ul className="saved-list">
          {cards.map((c) => (
            <li key={c._id} className="saved-item">
              <strong>{c.title}</strong>
              <div>
                <button className="btn" onClick={() => deleteCard(c._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </>
  );
}