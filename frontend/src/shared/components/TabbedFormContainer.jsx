import React, { useState } from 'react';

export default function TabbedFormContainer({
  title = '',
  name = '',
  mode = 'view',
  onNameChange = () => {},
  onDelete = () => {},
  onEditRequest = () => {},
  tabs = [],
  initialTabKey = '',
}) {
  const [activeTab, setActiveTab] = useState(initialTabKey || (tabs[0]?.key ?? ''));

  const handleDoubleClick = () => {
    if (mode === 'view') {
      onEditRequest();
    }
  };

  const currentTab = tabs.find(tab => tab.key === activeTab);

  return (
    <div className="p-6 bg-gray-100 h-auto flex justify-center items-start w-full">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-md border border-gray-300 p-8">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">{title}</h2>
          <button
            onClick={onDelete}
            className="text-gray-600 hover:text-red-600 transition"
            title={`Eliminar ${title}`}
          >
            🗑️
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del {title}:
          </label>
          <input
            type="text"
            value={name}
            onChange={onNameChange}
            onDoubleClick={handleDoubleClick}
            readOnly={mode === 'view'}
            className={`w-full border-b-2 py-2 px-4 text-xl text-gray-900 transition
              ${mode === 'view'
                ? 'bg-blue-100 border-transparent cursor-default'
                : 'border-blue-400 focus:outline-none'}`}
          />
        </div>

        <div className="tabs mb-4 border-b border-gray-300">
          <ul className="flex space-x-4">
            {tabs.map(tab => (
              <li
                key={tab.key}
                className={`px-3 py-2 cursor-pointer transition
                  ${activeTab === tab.key
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="tab-content">
          {currentTab?.component ?? <p className="text-sm text-gray-500">Sin contenido</p>}
        </div>
      </div>
    </div>
  );
}
