const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export function getToken(){ return localStorage.getItem('clms_token'); }
export async function request(path, options={}){
  const headers = { ...(options.headers || {}) };
  if(options.body && typeof options.body !== 'string') { headers['Content-Type'] = 'application/json'; options.body = JSON.stringify(options.body); }
  if(getToken()) headers.Authorization = `Bearer ${getToken()}`;
  const response = await fetch(`${API}${path}`, {...options, headers});
  const data = await response.json().catch(()=>({message:'Unexpected server response'}));
  if(!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}
