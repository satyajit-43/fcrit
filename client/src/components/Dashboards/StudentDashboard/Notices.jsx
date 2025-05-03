import { useState, useEffect } from "react";

function Notices() {
  const [noticeList, setNoticeList] = useState([]);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));

    fetch("http://localhost:3000/api/notice/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId: student._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const formattedNotices = data.notices.map((notice) => {
            const dateObj = new Date(notice.date);
            return {
              _id: notice._id,
              title: notice.title,
              description: notice.description,
              date: dateObj.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            };
          });
          setNoticeList(formattedNotices);
        }
      });
  }, []);

  return (
    <div className="w-full h-screen flex flex-col gap-5 items-center justify-center max-h-screen overflow-y-auto">
      <h1 className="text-black dark:text-white font-bold text-5xl">Notice Board</h1>
      <p className="text-black dark:text-white text-xl text-center px-5 sm:p-0">
        All official hostel notices will appear here
      </p>

      <div className="w-full max-w-xl p-4 border rounded-lg shadow sm:p-8 bg-slate-300 dark:bg-neutral-950 dark:border-neutral-900 drop-shadow-xl overflow-y-auto max-h-70">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-black dark:text-white">
            Latest Notices
          </h5>
        </div>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-700">
            {noticeList.length > 0 ? (
              noticeList.map((notice) => (
                <li className="py-3 sm:py-4" key={notice._id}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 text-black dark:text-white pt-1">
                      📢
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-black dark:text-white">
                        {notice.title}
                      </p>
                      <p className="text-sm truncate text-black dark:text-gray-400">
                        {notice.date}
                      </p>
                      <p className="text-sm text-black dark:text-gray-300 mt-1 line-clamp-2">
                        {notice.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-black dark:text-gray-400 text-sm text-center">No notices available.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Notices;
