import React, { useEffect, useState } from "react";

const MultiSelectInput = ({ colSpanWidth, label, required, array, data, setAction }) => {
    const [input, setInput] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setSelectedTags(Array.isArray(data?.roles) ? data.roles : []);
    }, [data?.roles]);

    const filteredOptions = array.filter(
        (opt) =>
            (input.trim() === "" || opt.toLowerCase().includes(input.toLowerCase())) &&
            !selectedTags.includes(opt)
    );

    const handleSelect = (item) => {
        if (selectedTags.includes(item)) return;
        const next = [...selectedTags, item];
        setSelectedTags(next);
        setAction((prev) => ({ ...prev, roles: next }));
        setInput("");
    };

    const removeItem = (item) => {
        const next = selectedTags.filter((i) => i !== item);
        setSelectedTags(next);
        setAction((prev) => ({ ...prev, roles: next }));
    };

    return (
        <div className={`flex flex-col col-span-${colSpanWidth} rounded-md`}>
            {label && <label className="mt-2 font-medium">
                {label}: {required && <span className="text-red-500 font-bold">*</span>}
            </label>}
            <div className="w-full border-1 border-gray200 rounded-md p-2">
                <div className="flex flex-col w-full p-1 rounded-md">
                    <div className={`${selectedTags.length > 0 && "mb-2"}`}>
                        {selectedTags.map((item) => (
                            <span
                                key={item}
                                className="bg-white border-1 border-gray-300 rounded-md p-1 mr-1"
                            >
                                <span>{item}</span>
                                <button className="ml-1 text-red-500 font-bold" onClick={() => removeItem(item)}>
                                    x
                                </button>
                            </span>
                        ))}
                    </div>
                    <input
                        className="p-2 bg-gray-100 rounded-md"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
                        placeholder="Ajouter un rôle..."
                    />
                </div>
                {isOpen && (
                    <ul className="bg-white rounded-md shadow-md max-h-64 overflow-auto">
                        {filteredOptions.map((item) => (
                            <li
                                key={item}
                                className="cursor-pointer p-2 border border-b-1 border-gray-300 hover:bg-gray-100"
                                onMouseDown={() => handleSelect(item)}
                            >
                                {item}
                            </li>
                        ))}
                        {filteredOptions.length === 0 && (
                            <li className="p-2 text-gray-400">Aucun résultat</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MultiSelectInput;