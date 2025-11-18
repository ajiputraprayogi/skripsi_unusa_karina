// import React, { useState, useEffect } from "react";

// interface Option {
//   value: string | number;
//   label: string;
// }

// interface SelectProps {
//   options: Option[];
//   placeholder?: string;
//   value?: string | number; // Controlled value
//   onChange: (value: string | number) => void;
//   className?: string;
//   defaultValue?: string | number;
//   disabled?: boolean; // ✅ Tambahkan prop disabled
// }

// const Select: React.FC<SelectProps> = ({
//   options,
//   placeholder = "Select an option",
//   onChange,
//   className = "",
//   defaultValue = "",
//   value = "",
//   disabled = false, // ✅ Default false
// }) => {
//   // Manage the selected value
//   // Gunakan string untuk state local, karena HTML select hanya bisa string
//   const [selectedValue, setSelectedValue] = useState<string>(
//     value !== undefined && value !== null ? String(value) : ""
//   );

//   useEffect(() => {
//     setSelectedValue(
//       value !== undefined && value !== null ? String(value) : ""
//     );
//   }, [value]);

//   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const val = e.target.value;
//     setSelectedValue(val);

//     // Coba convert kembali ke number jika cocok
//     const numVal = Number(val);
//     if (!isNaN(numVal) && options.some((opt) => opt.value === numVal)) {
//       onChange(numVal);
//     } else {
//       onChange(val);
//     }
//   };

//   return (
//     <select
//       className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
//         selectedValue
//           ? "text-gray-800 dark:text-white/90"
//           : "text-gray-400 dark:text-gray-400"
//       } ${className}`}
//       value={selectedValue || defaultValue}
//       onChange={handleChange}
//       disabled={disabled} // ✅ Apply ke elemen <select>
//     >
//       {/* Placeholder option */}
//       <option
//         value=""
//         disabled
//         className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
//       >
//         {placeholder}
//       </option>

//       {/* Map over options */}
//       {options.map((option) => (
//         <option key={option.value.toString()} value={option.value.toString()}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   );
// };

// export default Select;


import React, { useState, useEffect } from "react";
import { SelectHTMLAttributes } from 'react';

// --- Tipe Data Pendukung ---
interface Option {
    value: string | number;
    label: string;
}

// --- Tipe Props Utama (Diperbarui) ---
// Kita memperluas SelectHTMLAttributes untuk mewarisi semua atribut standar HTML, 
// seperti 'required', 'name', 'id', dll.
interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options: Option[];
    placeholder?: string;
    value?: string | number; // Controlled value
    // Kita mendefinisikan ulang onChange karena kita memiliki signature yang spesifik
    onChange: (value: string | number) => void;
    
    // Properti 'required' kini diwarisi dari SelectHTMLAttributes, 
    // tetapi kita tambahkan secara eksplisit jika Anda ingin lebih jelas.
    // required?: boolean; // Dihapus karena sudah diwarisi
}

const Select: React.FC<SelectProps> = ({
    options,
    placeholder = "Select an option",
    onChange,
    className = "",
    defaultValue = "",
    value = "",
    disabled = false, 
    required = false, // ✅ Ambil prop required
    // ... sisa props yang diwarisi dari SelectHTMLAttributes
    ...rest // ✅ Kumpulkan sisa props (termasuk required) untuk disalurkan ke elemen <select>
}) => {
    // Manage the selected value
    const [selectedValue, setSelectedValue] = useState<string>(
        value !== undefined && value !== null ? String(value) : ""
    );

    useEffect(() => {
        setSelectedValue(
            value !== undefined && value !== null ? String(value) : ""
        );
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedValue(val);

        // Coba convert kembali ke number jika cocok
        const numVal = Number(val);
        if (!isNaN(numVal) && options.some((opt) => opt.value === numVal)) {
            onChange(numVal);
        } else {
            onChange(val);
        }
    };

    return (
        <select
            className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                selectedValue
                    ? "text-gray-800 dark:text-white/90"
                    : "text-gray-400 dark:text-gray-400"
            } ${className}`}
            value={selectedValue || defaultValue}
            onChange={handleChange}
            disabled={disabled}
            required={required} // ✅ Terapkan prop required di sini
            {...rest} // ✅ Salurkan semua props HTML lainnya
        >
            {/* Placeholder option */}
            <option
                value=""
                disabled
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
            >
                {placeholder}
            </option>

            {/* Map over options */}
            {options.map((option) => (
                <option key={option.value.toString()} value={option.value.toString()}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select;