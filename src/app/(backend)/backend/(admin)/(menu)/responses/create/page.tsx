// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import ComponentCard from "@/components/common/ComponentCard";
// import Label from "@/components/form/Label";
// import Input from "@/components/form/input/InputField";
// import Button from "@/components/ui/button/Button";
// import Select from "@/components/form/Select";

// // --- TIPE DATA BARU ---
// type Option = {
//     text: string;
//     point: number;
// };

// // --- KOMPONEN INI BISA DIGUNAKAN UNTUK CREATE & EDIT ---

// function CreateEditQuestion() {
//     const [category, setCategory] = useState("");
//     const [questionText, setQuestionText] = useState("");
//     const [questionType, setQuestionType] = useState("");
//     const [correctAnswer, setCorrectAnswer] = useState(""); 
//     const [options, setOptions] = useState<Option[]>([]); 
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//     useEffect(() => {
//         document.title = "Tambah Pertanyaan Baru | Admin Panel";
//     }, []);

//     // --- LOGIC OTOMATIS GENERATE SKALA (DISESUAIKAN) ---
//     useEffect(() => {
//         // Skala default
//         const defaultOptions: Option[] = [
//             { text: "Sangat Setuju", point: 0 },
//             { text: "Setuju", point: 0 },
//             { text: "Tidak Setuju", point: 0 },
//             { text: "Sangat Tidak Setuju", point: 0 },
//         ];

//         // Disesuaikan: questionType === "skala_positif" (huruf kecil)
//         if (questionType === "skala_positif") {
//             // Skala Positif (Sangat Setuju = 4, Setuju = 3, dst.)
//             setOptions([
//                 { ...defaultOptions[0], point: 4 }, // Sangat Setuju
//                 { ...defaultOptions[1], point: 3 }, // Setuju
//                 { ...defaultOptions[2], point: 2 }, // Tidak Setuju
//                 { ...defaultOptions[3], point: 1 }, // Sangat Tidak Setuju
//             ]);
//         // Disesuaikan: questionType === "skala_negatif" (huruf kecil)
//         } else if (questionType === "skala_negatif") {
//             // Skala Negatif (Sangat Setuju = 1, Setuju = 2, dst.)
//             setOptions([
//                 { ...defaultOptions[0], point: 1 }, // Sangat Setuju
//                 { ...defaultOptions[1], point: 2 }, // Setuju
//                 { ...defaultOptions[2], point: 3 }, // Tidak Setuju
//                 { ...defaultOptions[3], point: 4 }, // Sangat Tidak Setuju
//             ]);
//         // Disesuaikan: questionType === "benar_salah" (huruf kecil)
//         } else if (questionType === "benar_salah") {
//             setOptions([]); 
//             setCorrectAnswer(""); 
//         }
//     }, [questionType]);

//     // --- FUNGSI SUBMIT (DISESUAIKAN) ---
//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();

//         // Validasi Dasar
//         if (!category || !questionText || !questionType) {
//             alert("Error: Kategori, Teks Pertanyaan, & Tipe wajib diisi.");
//             return;
//         }

//         // Validasi Khusus Tipe 1
//         // Disesuaikan: questionType === "benar_salah" (huruf kecil)
//         if (questionType === "benar_salah" && !correctAnswer) {
//             alert("Error: Jawaban Benar (TRUE/FALSE) wajib diisi.");
//             return;
//         }

//         setLoading(true);

//         // Menyiapkan data untuk dikirim ke API
//         // Disesuaikan: questionType === "benar_salah" (huruf kecil)
//         const finalCorrectAnswer = questionType === "benar_salah" 
//             ? JSON.stringify({ answer: correctAnswer }) 
//             : JSON.stringify({ options: options }); 

//         const postData = {
//             category,
//             question_text: questionText,
//             question_type: questionType,
//             correct_answer: finalCorrectAnswer,
//         };

//         try {
//             const res = await fetch("/api/backend/questions", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(postData),
//             });

//             if (!res.ok) {
//                 const err = await res.json();
//                 // Menampilkan error dari API jika ada (seperti "Tipe pertanyaan tidak valid")
//                 throw new Error(err.error || "Gagal membuat pertanyaan"); 
//             }

//             router.push("/backend/questions");
//         } catch (error) {
//             alert((error as Error).message);
//         } finally {
//             setLoading(false);
//         }
//     }

//     // Opsi untuk Tipe Pertanyaan (DISESUAIKAN)
//     const questionTypeOptions = [
//         // UBAH value ke 'benar_salah'
//         { label: "1. Benar/Salah (Kunci Jawaban)", value: "benar_salah" },
//         // UBAH value ke 'skala_positif'
//         { label: "2. Skala Positif (Skor Meningkat)", value: "skala_positif" },
//         // UBAH value ke 'skala_negatif'
//         { label: "3. Skala Negatif (Skor Menurun)", value: "skala_negatif" },
//     ];

//     // Opsi Kategori BARU (Tetap sama)
//     const categoryOptions = [
//         { label: "Kuesioner Pengetahuan Ibu", value: "PENGETAHUAN_IBU" },
//         { label: "Kuesioner Sikap Ibu", value: "SIKAP_IBU" },
//         { label: "Kuesioner Motivasi Ibu", value: "MOTIVASI_IBU" },
//     ];


//     return (
//         <div>
//             <PageBreadcrumb pageTitle="Tambah Pertanyaan Baru" />
//             <ComponentCard title="Form Tambah Pertanyaan">
//                 <form onSubmit={handleSubmit} className="grid gap-4">

//                     {/* KATEGORI */}
//                     <div>
//                         <Label>Kategori <span className="text-red-500">*</span></Label>
//                         <Select
//                             value={category}
//                             onChange={(val: string | number) => setCategory(String(val))}
//                             placeholder="Pilih Kategori"
//                             options={categoryOptions} // Menggunakan kategori baru
//                             required
//                         />
//                     </div>

//                     {/* TIPE PERTANYAAN */}
//                     <div>
//                         <Label>Tipe Pertanyaan <span className="text-red-500">*</span></Label>
//                         <Select
//                             value={questionType}
//                             onChange={(val: string | number) => setQuestionType(String(val))}
//                             placeholder="Pilih Tipe Pertanyaan"
//                             options={questionTypeOptions} // SUDAH DISESUAIKAN
//                             required
//                         />
//                     </div>

//                     {/* TEKS PERTANYAAN */}
//                     <div>
//                         <Label>Teks Pertanyaan <span className="text-red-500">*</span></Label>
//                         <textarea
//                             className="w-full rounded-md border border-gray-300 p-2"
//                             rows={4}
//                             required
//                             value={questionText}
//                             onChange={(e) => setQuestionText(e.target.value)}
//                             placeholder="Masukkan teks lengkap pertanyaan..."
//                         />
//                     </div>

//                     {/* --- CONDITIONAL FIELD BERDASARKAN TIPE --- */}

//                     {/* TIPE 1: TRUE / FALSE */}
//                     {/* Disesuaikan: questionType === "benar_salah" */}
//                     {questionType === "benar_salah" && (
//                         <div>
//                             <Label>Jawaban Benar <span className="text-red-500">*</span></Label>
//                             <Select
//                                 value={correctAnswer}
//                                 onChange={(val: string | number) => setCorrectAnswer(String(val))}
//                                 placeholder="Pilih Jawaban Benar"
//                                 options={[
//                                     { label: "Benar", value: "Benar" },
//                                     { label: "Salah", value: "Salah" },
//                                 ]}
//                                 required
//                             />
//                             <p className="text-xs text-gray-500 mt-1">
//                                 Kunci jawaban untuk soal Tipe Benar/Salah.
//                             </p>
//                         </div>
//                     )}

//                     {/* TIPE 2 & 3: SKALA POSITIF/NEGATIF */}
//                     {/* Disesuaikan: questionType harus cocok dengan nilai baru */}
//                     {(questionType === "skala_positif" || questionType === "skala_negatif") && (
//                         <div className="border p-4 rounded-lg bg-gray-50">
//                             <h4 className="font-semibold mb-3">Bobot Skala ({questionType === "skala_positif" ? "Positif" : "Negatif"})</h4>
//                             <p className="text-sm text-gray-600 mb-4">
//                                 Opsi dan poin di bawah ini di-*generate* secara otomatis berdasarkan Tipe Soal yang dipilih.
//                             </p>
                            
//                             <div className="grid grid-cols-2 gap-3">
//                                 {options.map((option, index) => (
//                                     <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-white">
//                                         <Label className="m-0 font-normal">{option.text}</Label>
//                                         <span className={`text-sm font-bold ${option.point > 2 ? 'text-green-600' : 'text-red-600'}`}>
//                                             ({option.point} poin)
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}


//                     {/* BUTTON */}
//                     <div className="flex justify-end pt-4 border-t border-gray-200 mt-2">
//                         <Button
//                             size="sm"
//                             variant="danger"
//                             type="button"
//                             onClick={() => router.back()}
//                             className="mr-2"
//                             disabled={loading}
//                         >
//                             Kembali
//                         </Button>

//                         <Button size="sm" variant="green" type="submit" disabled={loading}>
//                             {loading ? "Menyimpan..." : "Simpan Pertanyaan"}
//                         </Button>
//                     </div>
//                 </form>
//             </ComponentCard>
//         </div>
//     );
// }

// export default CreateEditQuestion;

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";

// --- TIPE DATA ---
type Option = {
    text: string;
    point: number;
};

// --- KOMPONEN KHUSUS CREATE ---
// Nama komponen diubah menjadi CreateQuestion untuk kejelasan
function CreateQuestion() { 
    const [category, setCategory] = useState("");
    const [questionText, setQuestionText] = useState("");
    const [questionType, setQuestionType] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState(""); 
    const [options, setOptions] = useState<Option[]>([]); 
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        document.title = "Tambah Pertanyaan Baru | Admin Panel";
    }, []);

    // --- LOGIC OTOMATIS GENERATE SKALA ---
    useEffect(() => {
        const defaultOptions: Option[] = [
            { text: "Sangat Setuju", point: 0 },
            { text: "Setuju", point: 0 },
            { text: "Tidak Setuju", point: 0 },
            { text: "Sangat Tidak Setuju", point: 0 },
        ];

        if (questionType === "skala_positif") {
            // Skala Positif (4, 3, 2, 1)
            setOptions([
                { ...defaultOptions[0], point: 4 }, 
                { ...defaultOptions[1], point: 3 }, 
                { ...defaultOptions[2], point: 2 }, 
                { ...defaultOptions[3], point: 1 }, 
            ]);
        } else if (questionType === "skala_negatif") {
            // Skala Negatif (1, 2, 3, 4)
            setOptions([
                { ...defaultOptions[0], point: 1 }, 
                { ...defaultOptions[1], point: 2 }, 
                { ...defaultOptions[2], point: 3 }, 
                { ...defaultOptions[3], point: 4 }, 
            ]);
        } else if (questionType === "benar_salah") {
            setOptions([]); 
            setCorrectAnswer(""); 
        } else {
             // Reset jika tidak ada tipe yang dipilih
             setOptions([]); 
             setCorrectAnswer(""); 
        }
    }, [questionType]);

    // --- FUNGSI SUBMIT (Hanya POST) ---
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Validasi Dasar
        if (!category || !questionText || !questionType) {
            alert("Error: Kategori, Teks Pertanyaan, & Tipe wajib diisi.");
            return;
        }

        // Validasi Khusus Tipe Benar/Salah
        if (questionType === "benar_salah" && !correctAnswer) {
            alert("Error: Jawaban Benar (TRUE/FALSE) wajib diisi.");
            return;
        }

        setLoading(true);

        // Menyiapkan data untuk dikirim ke API
        const finalCorrectAnswer = questionType === "benar_salah" 
            ? JSON.stringify({ answer: correctAnswer }) 
            : JSON.stringify({ options: options }); 

        const postData = {
            category,
            question_text: questionText,
            question_type: questionType,
            correct_answer: finalCorrectAnswer,
        };

        try {
            // HANYA MENGGUNAKAN METHOD POST
            const res = await fetch("/api/backend/questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Gagal membuat pertanyaan"); 
            }

            // Setelah sukses, redirect ke halaman daftar pertanyaan
            router.push("/backend/questions");
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setLoading(false);
        }
    }

    // Opsi untuk Tipe Pertanyaan
    const questionTypeOptions = [
        { label: "1. Benar/Salah (Kunci Jawaban)", value: "benar_salah" },
        { label: "2. Skala Positif (Skor Meningkat)", value: "skala_positif" },
        { label: "3. Skala Negatif (Skor Menurun)", value: "skala_negatif" },
    ];

    // Opsi Kategori
    const categoryOptions = [
        { label: "Kuesioner Pengetahuan Ibu", value: "PENGETAHUAN_IBU" },
        { label: "Kuesioner Sikap Ibu", value: "SIKAP_IBU" },
        { label: "Kuesioner Motivasi Ibu", value: "MOTIVASI_IBU" },
    ];


    return (
        <div>
            <PageBreadcrumb pageTitle="Tambah Pertanyaan Baru" />
            <ComponentCard title="Form Tambah Pertanyaan">
                <form onSubmit={handleSubmit} className="grid gap-4">

                    {/* KATEGORI */}
                    <div>
                        <Label>Kategori <span className="text-red-500">*</span></Label>
                        <Select
                            value={category}
                            onChange={(val: string | number) => setCategory(String(val))}
                            placeholder="Pilih Kategori"
                            options={categoryOptions} 
                            required
                        />
                    </div>

                    {/* TIPE PERTANYAAN */}
                    <div>
                        <Label>Tipe Pertanyaan <span className="text-red-500">*</span></Label>
                        <Select
                            value={questionType}
                            onChange={(val: string | number) => setQuestionType(String(val))}
                            placeholder="Pilih Tipe Pertanyaan"
                            options={questionTypeOptions} 
                            required
                        />
                    </div>

                    {/* TEKS PERTANYAAN */}
                    <div>
                        <Label>Teks Pertanyaan <span className="text-red-500">*</span></Label>
                        <textarea
                            className="w-full rounded-md border border-gray-300 p-2"
                            rows={4}
                            required
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder="Masukkan teks lengkap pertanyaan..."
                        />
                    </div>

                    {/* --- CONDITIONAL FIELD BERDASARKAN TIPE --- */}

                    {/* TIPE 1: TRUE / FALSE */}
                    {questionType === "benar_salah" && (
                        <div>
                            <Label>Jawaban Benar <span className="text-red-500">*</span></Label>
                            <Select
                                value={correctAnswer}
                                onChange={(val: string | number) => setCorrectAnswer(String(val))}
                                placeholder="Pilih Jawaban Benar"
                                options={[
                                    { label: "Benar", value: "Benar" },
                                    { label: "Salah", value: "Salah" },
                                ]}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Kunci jawaban untuk soal Tipe Benar/Salah.
                            </p>
                        </div>
                    )}

                    {/* TIPE 2 & 3: SKALA POSITIF/NEGATIF */}
                    {(questionType === "skala_positif" || questionType === "skala_negatif") && (
                        <div className="border p-4 rounded-lg bg-gray-50">
                            <h4 className="font-semibold mb-3">Bobot Skala ({questionType === "skala_positif" ? "Positif" : "Negatif"})</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Opsi dan poin di bawah ini di-*generate* secara otomatis berdasarkan Tipe Soal yang dipilih.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-3">
                                {options.map((option, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-white">
                                        <Label className="m-0 font-normal">{option.text}</Label>
                                        <span className={`text-sm font-bold ${option.point > 2 ? 'text-green-600' : 'text-red-600'}`}>
                                            ({option.point} poin)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* BUTTON */}
                    <div className="flex justify-end pt-4 border-t border-gray-200 mt-2">
                        <Button
                            size="sm"
                            variant="danger"
                            type="button"
                            onClick={() => router.back()}
                            className="mr-2"
                            disabled={loading}
                        >
                            Kembali
                        </Button>

                        <Button size="sm" variant="green" type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Pertanyaan"}
                        </Button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
}

export default CreateQuestion;