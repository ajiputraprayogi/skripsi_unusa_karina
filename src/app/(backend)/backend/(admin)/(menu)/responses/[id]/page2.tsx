// "use client"; // Pastikan ini tetap ada di bagian atas jika Anda menggunakan hooks seperti `useState` dan `useEffect`

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import ComponentCard from "@/components/common/ComponentCard";
// import Label from "@/components/form/Label";
// import Button from "@/components/ui/button/Button";
// import Select from "@/components/form/Select";

// // --- TIPE DATA ---
// type Option = {
//     text: string;
//     point: number;
// };

// // Tipe data untuk fetching dari API
// interface QuestionData {
//     id: number;
//     category: string;
//     question_text: string;
//     question_type: 'benar_salah' | 'skala_positif' | 'skala_negatif';
//     correct_answer: string; // String JSON dari database
//     created_at: string;
// }

// // Props yang DIBUTUHKAN oleh komponen klien (dipisahkan dari tipe Next.js PageProps)
// interface EditQuestionClientProps {
//     params: {
//         id: string; // ID pertanyaan yang akan di-edit dari URL
//     }
// }


// // --- KOMPONEN KLIEN UTAMA ---
// function EditQuestionClient({ params }: EditQuestionClientProps) {
//     const questionId = params.id;
    
//     // State untuk form
//     const [category, setCategory] = useState("");
//     const [questionText, setQuestionText] = useState("");
//     const [questionType, setQuestionType] = useState("");
//     const [correctAnswer, setCorrectAnswer] = useState(""); // Untuk Benar/Salah
//     const [options, setOptions] = useState<Option[]>([]); // Untuk Skala

//     // State untuk UI
//     const [loading, setLoading] = useState(false);
//     const [isFetching, setIsFetching] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // Ini menggunakan next/navigation, yang hanya ada di komponen klien
//     const router = useRouter(); 

//     // --- 1. FETCH DATA PERTANYAAN TUNGGAL ---
//     useEffect(() => {
//         document.title = `Edit Pertanyaan #${questionId} | Admin Panel`;

//         async function fetchQuestion() {
//             setError(null);
//             try {
//                 const res = await fetch(`/api/backend/questions/${questionId}`);
                
//                 if (!res.ok) {
//                     const err = await res.json();
//                     throw new Error(err.error || "Gagal mengambil data pertanyaan");
//                 }

//                 const data: QuestionData = await res.json();
                
//                 // Set state dengan data yang diambil
//                 setCategory(data.category);
//                 setQuestionText(data.question_text);
//                 setQuestionType(data.question_type);
                
//                 // Parsing correct_answer
//                 const parsedAnswer = JSON.parse(data.correct_answer);

//                 if (data.question_type === 'benar_salah') {
//                     setCorrectAnswer(parsedAnswer.answer || "");
//                 } else if (data.question_type.startsWith('skala')) {
//                     setOptions(parsedAnswer.options || []);
//                 }

//             } catch (error) {
//                 const errorMessage = `Gagal memuat pertanyaan: ${(error as Error).message}`;
//                 setError(errorMessage);
//                 console.error(errorMessage);
//                 // Redirect kembali jika gagal fetch (misal: ID tidak ditemukan)
//                 // Memberi waktu user membaca error sebelum redirect
//                 setTimeout(() => router.push("/backend/questions"), 3000); 
//             } finally {
//                 setIsFetching(false);
//             }
//         }

//         fetchQuestion();
//     }, [questionId, router]);


//     // --- 2. LOGIC OTOMATIS GENERATE SKALA / HANDLE TIPE PERUBAHAN ---
//     useEffect(() => {
//         if (isFetching) return;

//         const defaultOptions: Option[] = [
//             { text: "Sangat Setuju", point: 0 },
//             { text: "Setuju", point: 0 },
//             { text: "Tidak Setuju", point: 0 },
//             { text: "Sangat Tidak Setuju", point: 0 },
//         ];

//         let newOptions: Option[] = [];

//         if (questionType === "skala_positif") {
//             newOptions = [
//                 { ...defaultOptions[0], point: 4 }, 
//                 { ...defaultOptions[1], point: 3 }, 
//                 { ...defaultOptions[2], point: 2 }, 
//                 { ...defaultOptions[3], point: 1 }, 
//             ];
//         } else if (questionType === "skala_negatif") {
//             newOptions = [
//                 { ...defaultOptions[0], point: 1 }, 
//                 { ...defaultOptions[1], point: 2 }, 
//                 { ...defaultOptions[2], point: 3 }, 
//                 { ...defaultOptions[3], point: 4 }, 
//             ];
//         } else {
//             newOptions = [];
//         }
        
//         if (questionType.startsWith("skala")) {
//             setOptions(newOptions);
//         } else if (questionType === "benar_salah") {
//              setOptions([]);
//         } else {
//             setOptions([]);
//             setCorrectAnswer("");
//         }
        
//     }, [questionType, isFetching]);


//     // Handle saat user mengganti tipe pertanyaan
//     const handleQuestionTypeChange = (val: string | number) => {
//         const newType = String(val);
//         setQuestionType(newType);

//         // Jika user mengganti tipe, reset nilai yang tidak relevan
//         if (newType !== 'benar_salah') {
//             setCorrectAnswer("");
//         } else {
//             setOptions([]);
//         }
//     };


//     // --- 3. FUNGSI SUBMIT (Menggunakan PUT) ---
//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         setError(null);

//         // Validasi Dasar
//         if (!category || !questionText || !questionType) {
//             setError("Kategori, Teks Pertanyaan, & Tipe wajib diisi.");
//             return;
//         }

//         // Validasi Khusus Tipe Benar/Salah
//         if (questionType === "benar_salah" && !correctAnswer) {
//             setError("Jawaban Benar (TRUE/FALSE) wajib diisi.");
//             return;
//         }

//         setLoading(true);

//         // Menyiapkan data untuk dikirim ke API
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
//             // MENGGUNAKAN METHOD PUT UNTUK UPDATE
//             const res = await fetch(`/api/backend/questions/${questionId}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(postData),
//             });

//             if (!res.ok) {
//                 const err = await res.json();
//                 throw new Error(err.error || "Gagal memperbarui pertanyaan"); 
//             }

//             // Setelah sukses, redirect ke halaman daftar pertanyaan
//             router.push("/backend/questions");
//         } catch (error) {
//             const errorMessage = (error as Error).message;
//             setError(errorMessage);
//             console.error("Update Error:", errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     }

//     // Opsi untuk Tipe Pertanyaan
//     const questionTypeOptions = [
//         { label: "1. Benar/Salah (Kunci Jawaban)", value: "benar_salah" },
//         { label: "2. Skala Positif (Skor Meningkat)", value: "skala_positif" },
//         { label: "3. Skala Negatif (Skor Menurun)", value: "skala_negatif" },
//     ];

//     // Opsi Kategori
//     const categoryOptions = [
//         { label: "Kuesioner Pengetahuan Ibu", value: "PENGETAHUAN_IBU" },
//         { label: "Kuesioner Sikap Ibu", value: "SIKAP_IBU" },
//         { label: "Kuesioner Motivasi Ibu", value: "MOTIVASI_IBU" },
//     ];
    
//     // Tampilkan loading state saat mengambil data awal
//     if (isFetching) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <p className="text-lg text-gray-500">Memuat data pertanyaan...</p>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <PageBreadcrumb pageTitle={`Edit Pertanyaan #${questionId}`} />
//             <ComponentCard title={`Form Edit Pertanyaan ID: ${questionId}`}>
//                 {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
//                         <strong className="font-bold">Error!</strong>
//                         <span className="block sm:inline ml-2">{error}</span>
//                     </div>
//                 )}
//                 <form onSubmit={handleSubmit} className="grid gap-4">

//                     {/* KATEGORI */}
//                     <div>
//                         <Label>Kategori <span className="text-red-500">*</span></Label>
//                         <Select
//                             value={category}
//                             onChange={(val: string | number) => setCategory(String(val))}
//                             placeholder="Pilih Kategori"
//                             options={categoryOptions} 
//                             required
//                         />
//                     </div>

//                     {/* TIPE PERTANYAAN */}
//                     <div>
//                         <Label>Tipe Pertanyaan <span className="text-red-500">*</span></Label>
//                         <Select
//                             value={questionType}
//                             onChange={handleQuestionTypeChange} 
//                             placeholder="Pilih Tipe Pertanyaan"
//                             options={questionTypeOptions} 
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
//                             Batal
//                         </Button>

//                         <Button size="sm" variant="green" type="submit" disabled={loading}>
//                             {loading ? "Memperbarui..." : "Perbarui Pertanyaan"}
//                         </Button>
//                     </div>
//                 </form>
//             </ComponentCard>
//         </div>
//     );
// }


// // --- KOMPONEN SERVER/PAGE YANG DIEKSPOR SECARA DEFAULT ---
// // Menggunakan 'any' pada params untuk menghindari konflik dengan Next.js Type Checker
// // yang bermasalah.
// export default function EditQuestionPage({ params }: any) {
    
//     // Memastikan params tetap bertipe { id: string } sebelum diteruskan
//     const typedParams: { id: string } = params;

//     // Render komponen klien, meneruskan prop params
//     return <EditQuestionClient params={typedParams} />;
// }

