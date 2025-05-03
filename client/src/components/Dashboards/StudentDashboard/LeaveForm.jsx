// import { useState } from "react";
// import { Input } from "../../LandingSite/AuthPage/Input";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function LeaveForm() {
//   const registerSuggestions = async (e) => {
//     e.preventDefault();
//     const student = JSON.parse(localStorage.getItem("student"));
//     const response = await fetch("http://localhost:3000/api/leave/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({student: student._id, hostel: student.hostel, title, description: desc}),
//     });

//     const data = await response.json();
//     if (data.success) {
//       toast.success("Suggestion registered successfully", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         draggable: true,
//         });
//     } else {
//       toast.error("Suggestion registration failed", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         draggable: true,
//         });
//     }
//   };



//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");
//   const [leaveDate, setLeaveDate] = useState("");
//   const [returnDate, setReturnDate] = useState("");
//   const [type, setType] = useState("Personal");

//   const types = ["Personal", "Medical", "Emergency", "Festival", "Others"];

//   function titleChange(e) {
//     setTitle(e.target.value);
//   }
//   function descChange(e) {
//     setDesc(e.target.value);
//   }
//   function handlestartChange(e) {
//     setLeaveDate(e.target.value);
//   }
//   function handleendChange(e) {
//     setReturnDate(e.target.value);
//   }
//   function chngType(e) {
//     setType(e.target.value);
//   }

//   const formTitle = {
//     name: "Purpose of Leave",
//     placeholder: "Reason",
//     req: true,
//     type: "text",
//     value: title,
//     onChange: titleChange,
//   };

//   const startDate = {
//     name: "leaving date",
//     placeholder: "",
//     req: true,
//     type: "date",
//     value: leaveDate,
//     onChange: handlestartChange,
//   };

//   const endDate = {
//     name: "return date",
//     placeholder: "",
//     req: true,
//     type: "date",
//     value: returnDate,
//     onChange: handleendChange,
//   };

//   const leaveType = {
//     name: "Leave type",
//     placeholder: "Type...",
//     req: true,
//     type: "text",
//     value: type,
//     onChange: chngType,
//   };

//   return (
//     <div className="w-full h-screen flex flex-col gap-10 items-center justify-center max-h-screen overflow-y-auto">
//       <h1 className="text-white font-bold text-5xl mt-5">Leave Form</h1>
//       <form
//         method="POST"
//         onSubmit={registerSuggestions}
//         className="md:w-[30vw] w-full py-5 pb-7 px-10 bg-neutral-950 rounded-lg shadow-xl flex flex-col gap-5"
//       >
//         <Input field={formTitle} />
//         <div>
//         {/* <label
//             htmlFor="suggestion"
//             className="block mb-2 text-sm font-medium text-white"
//           >
//             Your Leave description
//         </label>
//           <textarea
//             name="suggestion"
//             placeholder="Description..."
//             className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 outline-none"
//             onChange={descChange}
//             value={desc}
//           ></textarea> */}


//             <label
//               htmlFor="description"
//               className="block mb-2 text-sm font-medium text-white"
//             >
//               Your Leave type
//             </label>
//             <select
//               className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 outline-none"
//               onChange={chngType}
//             >
//               {types.map((type) => (
//                 <option key={type}>{type}</option>
//               ))}
//             </select>
//             {type.toLowerCase() === "personal" ||
//             type.toLowerCase() === "medical" ||
//             type.toLowerCase() === "emergency" ||
//             type.toLowerCase() === "festival" ? (
//               <></>
//             ) : (
//               <div className="mt-5">
//                 <Input field={leaveType} />
//               </div>
//             )}

//           <Input field={startDate} />
//           <Input field={endDate} />

//           <button
//             type="submit"
//             className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 text-lg rounded-lg px-5 py-2.5 mt-5 text-center"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={true}
//         closeOnClick={true}
//         rtl={false}
//         pauseOnFocusLoss={true}
//         draggable={true}
//         pauseOnHover={true}
//         theme="dark"
//       />
//     </div>
//   );
// }

// export default LeaveForm;





import { useEffect, useState } from "react";
import { Input } from "../../LandingSite/AuthPage/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Leave() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestsList, setRequestsList] = useState([]);

  const handleFromDate = (e) => setFromDate(e.target.value);
  const handleToDate = (e) => setToDate(e.target.value);
  const handleReason = (e) => setReason(e.target.value);

  const fromDateInput = {
    name: "From Date",
    placeholder: "",
    req: true,
    type: "date",
    value: fromDate,
    onChange: handleFromDate,
  };

  const toDateInput = {
    name: "To Date",
    placeholder: "",
    req: true,
    type: "date",
    value: toDate,
    onChange: handleToDate,
  };

  const reasonInput = {
    name: "Reason",
    placeholder: "e.g. Family function, medical...",
    req: true,
    type: "text",
    value: reason,
    onChange: handleReason,
  };

  const requestLeave = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const student = JSON.parse(localStorage.getItem("student"));
  
    const response = await fetch("http://localhost:3000/api/leave/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student: student._id,
        hostel: student.hostel, // ✅ Important
        from_date: fromDate,
        to_date: toDate,
        reason,
      }),
    });
  
    const result = await response.json();
  
    if (result.success) {
      toast.success("Leave Requested Successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      setFromDate("");
      setToDate("");
      setReason("");
      fetchRequests();
    } else {
      toast.error(result.message || "Failed to request leave", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  
    setLoading(false);
  };
  

  const fetchRequests = async () => {
    const student = JSON.parse(localStorage.getItem("student"));
    const res = await fetch("http://localhost:3000/api/leave/myrequests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ student: student._id }),
    });

    const data = await res.json();
    if (data.success) {
      setRequestsList(data.list);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pt-20 gap-10">
      <h1 className="text-black dark:text-white font-bold text-4xl">Leave Request</h1>

      <form onSubmit={requestLeave} className="bg-slate-300 dark:bg-neutral-950 p-6 rounded-xl shadow-lg w-full max-w-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input field={fromDateInput} />
          <Input field={toDateInput} />
        </div>
        <div className="mt-4">
          <Input field={reasonInput} />
        </div>
        <button
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 text-lg rounded-lg px-5 py-2.5 mt-5 text-center"
        >
          {loading ? "Sending Request..." : "Request Leave"}
        </button>
      </form>

      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">My Leave Requests</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {requestsList.length === 0 ? (
            <li className="text-gray-500 dark:text-gray-400">No leave requests yet.</li>
          ) : (
            requestsList.sort((a, b) => new Date(b.from_date) - new Date(a.from_date)).map((req) => (
              <li key={req._id} className="py-4 flex flex-col">
                <span className="font-medium text-black dark:text-white">
                  {new Date(req.from_date).toDateString()} to {new Date(req.to_date).toDateString()}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {req.reason}
                </span>
                <span className={`mt-1 text-sm font-semibold ${
                  req.status === "approved"
                    ? "text-green-600"
                    : req.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}>
                  Status: {req.status.toUpperCase()}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Leave;

