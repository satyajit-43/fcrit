import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RoomAllocation() {
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [hostelRooms, setHostelRooms] = useState([]);

  // Fetch student and room data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const studentData = JSON.parse(localStorage.getItem("student"));
      setStudent(studentData);

      if (studentData?.room_no) {
        try {
          const res = await fetch(`http://localhost:3000/api/rooms/student/${studentData._id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch room details');
          }
          const data = await res.json();
          if (data.success) {
            setRoomDetails(data.room);
          } else {
            console.error(data.error);
            // Clear room details if invalid
            localStorage.setItem("student", JSON.stringify({
              ...studentData,
              room_no: undefined
            }));
          }
        } catch (error) {
          console.error('Error fetching room:', error);
        }
      }
      // Fetch all rooms in the student's hostel
      if (studentData?.hostel) {
        const roomsRes = await fetch(`http://localhost:3000/api/rooms/hostel/${studentData.hostel}`);
        const roomsData = await roomsRes.json();
        setHostelRooms(roomsData);
      }
    };

    fetchData();
  }, []);

  // Request room allocation
  const requestAllocation = async (roomId) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/rooms/allocate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student: student._id,  // Changed from studentId to student
          room: roomId           // Changed from roomId to room
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to request allocation");
      }
  
      const data = await res.json();
  
      toast.success("Room allocated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Update both student and room details
      const updatedStudent = { 
        ...student, 
        room_no: data.room.roomNumber 
      };
      
      setStudent(updatedStudent);
      setRoomDetails(data.room);
      localStorage.setItem("student", JSON.stringify(updatedStudent));
      
      // Refresh available rooms
      const roomsRes = await fetch(`http://localhost:3000/api/rooms/hostel/${student.hostel}`);
      const roomsData = await roomsRes.json();
      setHostelRooms(roomsData);
  
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full min-h-screen flex flex-col items-center p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Room Allocation</h1>
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Allocation Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {student?.room_no ? "Your Room Details" : "No Room Allocated"}
          </h2>

          {student?.room_no ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-gray-600 dark:text-gray-300 w-32">Room Number:</span>
                <span className="font-medium text-gray-800 dark:text-white">{roomDetails?.roomNumber}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 dark:text-gray-300 w-32">Floor:</span>
                <span className="font-medium text-gray-800 dark:text-white">{roomDetails?.floor}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 dark:text-gray-300 w-32">Room Type:</span>
                <span className="font-medium text-gray-800 dark:text-white capitalize">{roomDetails?.roomType}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 dark:text-gray-300 w-32">Capacity:</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {roomDetails?.currentOccupancy}/{roomDetails?.capacity}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 dark:text-gray-300 w-32">Status:</span>
                <span className={`font-medium capitalize ${
                  roomDetails?.status === 'available' ? 'text-green-600' : 
                  roomDetails?.status === 'occupied' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {roomDetails?.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-300">
              <p className="mb-4">You haven't been allocated a room yet.</p>
              <p>Please check available rooms below and submit a request.</p>
            </div>
          )}
        </div>

        {/* Available Rooms Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Available Rooms in Your Hostel
          </h2>

          {hostelRooms.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Room No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Available</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {hostelRooms
                    .filter(room => room.status !== 'occupied')
                    .map((room) => (
                      <tr key={room._id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {room.roomNumber}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                          {room.roomType}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {room.capacity - room.currentOccupancy} / {room.capacity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {!student?.room_no && (
                            <button
                              onClick={() => requestAllocation(room._id)}
                              disabled={loading || room.status === 'under_maintenance'}
                              className={`px-3 py-1 rounded-md text-sm ${
                                room.status === 'under_maintenance'
                                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              {loading ? 'Processing...' : 'Request'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No available rooms found in your hostel.</p>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default RoomAllocation;