export default function FormTabs({ activeTab, handleTabChange }) {
  const tabs = [
    { key: 'informacion-general', label: 'Información General' },
    { key: 'atributos-variantes', label: 'Atributos y Variantes' },
    { key: 'ventas', label: 'Ventas' },
    { key: 'compra', label: 'Compra' },
  ];

  return (
    <div className="tabs-container mb-6 mt-1">
      <ul className="flex space-x-4 border-b-2 border-gray-300">
        {tabs.map((tab) => (
          <li
            key={tab.key}
            className={`px-4 py-2 cursor-pointer text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900'
            }`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </div>
  );
}