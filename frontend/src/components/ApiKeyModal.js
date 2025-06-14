import { useState } from "react";

export default function ApiKeyModal({ show, onClose, onSave }) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      setError("Por favor, insira sua chave de API");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3333/api/set-api-key",
        {
          apiKey: apiKey,
        }
      );

      if (response.data.sucesso) {
        onSave(apiKey);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.erro || "Erro ao salvar chave de API");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-white mb-4">
          Configurar Chave de API
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-gray-300 mb-2">
              Sua Chave de API do OpenRouter:
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cole sua chave aqui"
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>

        <p className="text-gray-400 text-xs mt-4">
          Sua chave é armazenada localmente no navegador e só é enviada para o
          servidor quando necessário.
        </p>
      </div>
    </div>
  );
}
