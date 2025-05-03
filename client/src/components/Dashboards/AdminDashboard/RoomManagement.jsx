import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RoomManagement() {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Get hostel from localStorage
  const currentHostel = JSON.parse(localStorage.getItem("hostel"));
  
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    hostel: currentHostel._id, // Auto-set from localStorage
    capacity: 2,
    floor: '',
    roomType: 'standard'
  });

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const currentHostel = JSON.parse(localStorage.getItem("hostel"));
        
        // Updated endpoint to match backend route
        const studentsUrl = `http://localhost:3000/api/student/hostel/${currentHostel._id}`;
        const roomsUrl = `http://localhost:3000/api/rooms/hostel/${currentHostel._id}`;
  
        const [roomsRes, studentsRes] = await Promise.all([
          fetch(roomsUrl),
          fetch(studentsUrl)
        ]);
  
        if (!roomsRes.ok) throw new Error('Failed to fetch rooms');
        if (!studentsRes.ok) throw new Error('Failed to fetch students');
  
        const roomsData = await roomsRes.json();
        const studentsData = await studentsRes.json();
  
        setRooms(roomsData);
        setStudents(studentsData.students); // No need to filter here - backend does it
      } catch (error) {
        toast.error(error.message, { position: 'top-right' });
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Calculate available rooms
  const availableRooms = rooms.filter(room => 
    room.status !== 'under_maintenance' && 
    room.currentOccupancy < room.capacity
  );

  // Create new room - modified to use currentHostel
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newRoom,
          hostel: currentHostel._id // Ensure hostel is always current
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Room added successfully!', { position: 'top-right' });
        setRooms([...rooms, data.room]);
        setNewRoom({
          roomNumber: '',
          hostel: currentHostel._id,
          capacity: 2,
          floor: '',
          roomType: 'standard'
        });
      } else {
        toast.success(data.error || 'Room created successfully!', { position: 'top-right' });
      }
    } catch (error) {
      toast.error('An error occurred', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };


  // Allocate student to room
  const handleAllocate = async () => {
    if (!selectedRoom || !selectedStudent) {
      toast.warning('Please select both a student and a room', { position: 'top-right' });
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/rooms/allocate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student: selectedStudent,  // Changed from studentId to student
          room: selectedRoom         // Changed from roomId to room
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to allocate student');
      }
  
      const data = await res.json();
  
      toast.success('Student allocated successfully!', { position: 'top-right' });
      // Update local state
      const updatedRooms = rooms.map(room => 
        room._id === selectedRoom ? data.room : room
      );
      setRooms(updatedRooms);
      setStudents(students.filter(student => student._id !== selectedStudent));
      setSelectedRoom(null);
      setSelectedStudent(null);
    } catch (error) {
      toast.error(error.message, { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  // Deallocate student from room
  const handleDeallocate = async (roomId, studentId) => {
    if (!window.confirm('Are you sure you want to deallocate this student?')) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/rooms/deallocate/${studentId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Student deallocated successfully!', { position: 'top-right' });
        // Update local state
        const updatedRooms = rooms.map(room => 
          room._id === roomId ? data.room : room
        );
        setRooms(updatedRooms);
        // Add student back to unallocated list
        const student = data.student;
        setStudents([...students, student]);
      } else {
        toast.error(data.error || 'Failed to deallocate student', { position: 'top-right' });
      }
    } catch (error) {
      toast.error('An error occurred', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  // Update room status
  const handleStatusChange = async (roomId, newStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/rooms/${roomId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Room status updated!', { position: 'top-right' });
        const updatedRooms = rooms.map(room => 
          room._id === roomId ? data.room : room
        );
        setRooms(updatedRooms);
      } else {
        toast.error(data.error || 'Failed to update status', { position: 'top-right' });
      }
    } catch (error) {
      toast.error('An error occurred', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Room Management - {currentHostel.name}
      </h1>
      
      {/* Create New Room Section - Removed hostel selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add New Room</h2>
        <form onSubmit={handleCreateRoom} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Number</label>
            <input
              type="text"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={newRoom.roomNumber}
              onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Floor</label>
            <input
              type="text"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={newRoom.floor}
              onChange={(e) => setNewRoom({...newRoom, floor: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
            <select
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={newRoom.capacity}
              onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value)})}
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'student' : 'students'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Type</label>
            <select
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={newRoom.roomType}
              onChange={(e) => setNewRoom({...newRoom, roomType: e.target.value})}
            >
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="ac">AC</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>

      {/* Allocation Section */}
      <div id="allocate-section" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Allocate Students</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Student
            </label>
            <select
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={selectedStudent || ''}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={students.length === 0 || loading}
            >
              <option value="">{loading ? 'Loading...' : 'Select Student'}</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name} (Roll: {student.roll_no})
                </option>
              ))}
            </select>
            {students.length === 0 && !loading && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                No unallocated students found
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Available Room
            </label>
            <select
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={selectedRoom || ''}
              onChange={(e) => setSelectedRoom(e.target.value)}
              disabled={availableRooms.length === 0 || loading}
            >
              <option value="">{loading ? 'Loading...' : 'Select Room'}</option>
              {availableRooms.map(room => (
                <option key={room._id} value={room._id}>
                  Room {room.roomNumber} (Floor {room.floor})
                </option>
              ))}
            </select>
            {availableRooms.length === 0 && !loading && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                No available rooms found
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleAllocate}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50"
          disabled={loading || !selectedRoom || !selectedStudent}
        >
          {loading ? 'Processing...' : 'Allocate Student'}
        </button>
      </div>

      {/* Rooms List Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">All Rooms</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Room No.</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hostel</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Floor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Occupancy</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th> */}
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Students</th> */}
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th> */}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {rooms.map(room => (
                <tr key={room._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {room.roomNumber}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {hostels.find(h => h._id === room.hostel)?.name || 'N/A'}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {room.floor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                    {room.roomType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {room.currentOccupancy}/{room.capacity}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <select
                      value={room.status}
                      onChange={(e) => handleStatusChange(room._id, e.target.value)}
                      className={`p-1 rounded border ${
                        room.status === 'available' ? 'bg-green-100 dark:bg-green-900' :
                        room.status === 'occupied' ? 'bg-yellow-100 dark:bg-yellow-900' :
                        'bg-red-100 dark:bg-red-900'
                      }`}
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="under_maintenance">Maintenance</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {room.currentOccupancy > 0 ? (
                      <ul className="list-disc pl-5">
                        {room.occupants?.map(studentId => {
                          const student = students.find(s => s._id === studentId) || 
                                         { name: 'Unknown', roll_no: 'N/A' };
                          return (
                            <li key={studentId}>
                              {student.name} ({student.roll_no})
                              <button
                                onClick={() => handleDeallocate(room._id, studentId)}
                                className="ml-2 text-red-600 hover:text-red-800 text-xs"
                              >
                                Deallocate
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : 'None'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <button
                      onClick={() => {
                        setSelectedRoom(room._id);
                        document.getElementById('allocate-section').scrollIntoView();
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      disabled={room.status === 'under_maintenance' || room.currentOccupancy >= room.capacity}
                    >
                      Allocate
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default RoomManagement;