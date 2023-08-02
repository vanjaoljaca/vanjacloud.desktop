import { useState } from "react";

export function TabView({ names, children, activeTabIndex }) { //, activeTabIndexChanged?
    const [activeTab, setActiveTab] = useState(activeTabIndex);

    // activeTabIndexChanged = activeTabIndexChanged;


    return (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 flex flex-col flex-grow">
            <ul className="flex flex-wrap -mb-px">
                {names.map((name, index) => (
                    <li key={name} className="mr-2">
                        <button
                            onClick={() => setActiveTab(index)}
                            className={`inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 
                                        hover:border-gray-300 dark:hover:text-gray-300 
                                        ${activeTab === index ? "text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500" : "border-transparent"}`}
                            aria-current={activeTab === index ? "page" : undefined}
                        >
                            {name}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="flex-grow w-full overflow-auto">
                {children[activeTab]}
            </div>
        </div>
    );
}
