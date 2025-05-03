import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingBar from 'react-top-loading-bar';

function Notice() {
  const [Progress, setProgress] = useState(0);
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchNotices = async () => {
    setProgress(30);
    try {
      const res = await fetch("http://localhost:3000/api/notice/getall");
      const data = await res.json();
      if (data.success) {
        setNotices(data.notices.reverse());
      } else {
        toast.error("Failed to fetch notices.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
    setProgress(100);
  };

  const createNotice = async () => {
    if (!title || !description) {
      return toast.warn("Please fill out all fields.");
    }

    setProgress(30);
    try {
      const res = await fetch("http://localhost:3000/api/notice/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description })
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Notice created successfully!");
        setTitle("");
        setDescription("");
        fetchNotices();
      } else {
        toast.error("Failed to create notice.");
      }
    } catch (err) {
      toast.error("Server error!");
    }
    setProgress(100);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-10 gap-5">
      <LoadingBar color='#00bfff' progress={Progress} onLoaderFinished={() => setProgress(0)} />
      <h1 className="text-black dark:text-white text-4xl font-bold mt-12">Notice Board</h1>
    <div className="w-[1100px] flex flex-row items-center gap-[40px] mt-[30px]">
      <div className="w-full sm:w-1/2 bg-slate-300 dark:bg-neutral-900 p-6 rounded-xl shadow-xl">
        <h2 className="text-black dark:text-white text-xl mb-4 font-semibold">Create New Notice</h2>
        <input
          type="text"
          className="w-full p-2 mb-3 rounded dark:bg-neutral-800 dark:text-white"
          placeholder="Notice Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 mb-3 rounded dark:bg-neutral-800 text-black dark:text-white"
          placeholder="Notice Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={createNotice}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-800 transition-all"
        >
          Post Notice
        </button>
      </div>

      <div className="w-full sm:w-1/2 bg-slate-300 dark:bg-neutral-950 px-8 py-5 mt-1 rounded-xl shadow-lg text-black dark:text-white max-h-[600px] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-3">All Notices</h2>
        <ul className="divide-y divide-gray-700">
          {notices.length === 0
            ? <p>No notices found.</p>
            : notices.map((notice) => (
                <li key={notice._id} className="py-3">
                  <h3 className="font-bold text-lg">{notice.title}</h3>
                  <p className="text-black dark:text-gray-300">{notice.description}</p>
                  <p className="text-black dark:text-gray-500 text-sm">
                    {new Date(notice.date).toLocaleString()}
                  </p>
                </li>
              ))}
        </ul>
      </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Notice;
